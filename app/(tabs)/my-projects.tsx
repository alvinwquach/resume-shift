import { Ionicons } from "@expo/vector-icons";
import { useState, useRef, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth";
import { useProjectRanking } from "../../hooks/useProjectRanking";
import { ProjectRankingResults } from "../../components/project-ranking/ProjectRankingResults";
import type { RankedProject } from "../../types/project";
import { FUNCTIONS_ENDPOINTS } from "../../services/functionsConfig";
import { saveProjectRanking } from "../../services/projectService";

type ProjectInput = {
  id: string;
  title: string;
  description: string;
};

type ChatMessage = {
  id: string;
  type: "user" | "assistant" | "system";
  content: string;
  project?: RankedProject;
};

const MAX_PROJECTS = 5;

export default function RankProjects() {
  const { user } = useAuth();
  const { rankProject, isRanking } = useProjectRanking();
  const queryClient = useQueryClient();
  const scrollViewRef = useRef<ScrollView>(null);

  const [projects, setProjects] = useState<ProjectInput[]>([
    { id: "1", title: "", description: "" },
  ]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [rankedProjects, setRankedProjects] = useState<RankedProject[]>([]);
  const [hasStartedRanking, setHasStartedRanking] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [currentRankingIndex, setCurrentRankingIndex] = useState(0);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const addProject = () => {
    if (projects.length >= MAX_PROJECTS) {
      Alert.alert("Limit Reached", `You can rank up to ${MAX_PROJECTS} projects at once.`);
      return;
    }
    setProjects([...projects, { id: Date.now().toString(), title: "", description: "" }]);
  };

  const removeProject = (id: string) => {
    if (projects.length > 1) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  const updateProject = (id: string, field: "title" | "description", value: string) => {
    setProjects(projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const handleStartRanking = async () => {
    // Validate
    const validProjects = projects.filter((p) => p.title.trim() && p.description.trim());
    if (validProjects.length === 0) {
      Alert.alert("No Projects", "Please add at least one project with title and description");
      return;
    }

    setHasStartedRanking(true);
    setMessages([]);
    setRankedProjects([]);

    // Add welcome message
    const welcomeMsg: ChatMessage = {
      id: "welcome",
      type: "system",
      content: `🚀 Analyzing ${validProjects.length} ${validProjects.length === 1 ? "project" : "projects"} across multiple tech roles...`,
    };
    setMessages([welcomeMsg]);

    // Track ranked projects locally for final summary
    const localRankedProjects: RankedProject[] = [];

    // Rank each project sequentially
    for (let i = 0; i < validProjects.length; i++) {
      const project = validProjects[i];
      setCurrentRankingIndex(i);

      // Add user project message
      const projectMsg: ChatMessage = {
        id: `project-${project.id}`,
        type: "user",
        content: `**${project.title}**\n\n${project.description}`,
      };
      setMessages((prev) => [...prev, projectMsg]);

      // Add analyzing message
      const analyzingMsg: ChatMessage = {
        id: `analyzing-${project.id}`,
        type: "assistant",
        content: `🔍 Analyzing "${project.title}" (${i + 1}/${validProjects.length})...`,
      };
      setMessages((prev) => [...prev, analyzingMsg]);

      // Rank the project
      const projectDescription = `
Project Title: ${project.title}

Description:
${project.description}
      `.trim();

      const result = await rankProject({
        projectDescription,
      });

      // Remove analyzing message
      setMessages((prev) => prev.filter((m) => m.id !== analyzingMsg.id));

      if (result) {
        const rankedProject: RankedProject = {
          id: project.id,
          title: project.title,
          description: project.description,
          rankingResult: result,
        };

        localRankedProjects.push(rankedProject);
        setRankedProjects((prev) => [...prev, rankedProject]);

        // Add result message
        const resultMsg: ChatMessage = {
          id: `result-${project.id}`,
          type: "assistant",
          content: `✅ Complete: ${result.bestFitRoles?.join(", ") || "Analysis ready"}`,
          project: rankedProject,
        };
        setMessages((prev) => [...prev, resultMsg]);
      } else {
        const errorMsg: ChatMessage = {
          id: `error-${project.id}`,
          type: "assistant",
          content: `❌ Failed to analyze "${project.title}"`,
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    }

    // Generate portfolio recommendations using local array
    const portfolioRecommendations = generatePortfolioRecommendations(localRankedProjects);

    // Add completion message with recommendations
    const completeMsg: ChatMessage = {
      id: "complete",
      type: "system",
      content: portfolioRecommendations,
    };
    setMessages((prev) => [...prev, completeMsg]);

    // Auto-save
    if (user && localRankedProjects.length > 0) {
      try {
        console.log('Saving project rankings:', localRankedProjects.length, 'projects');
        const docId = await saveProjectRanking(user.uid, localRankedProjects);
        console.log('Project rankings saved successfully. Doc ID:', docId);
        // Invalidate cache to refresh dashboard
        queryClient.invalidateQueries({ queryKey: ['projectRankings', user.uid] });
      } catch (error) {
        console.error('Failed to save project rankings:', error);
      }
    }
  };

  const generatePortfolioRecommendations = (projects: RankedProject[]): string => {
    if (projects.length === 0) return "No projects to analyze.";

    // Calculate average scores for each project
    const projectScores = projects.map(p => {
      const avgScore = p.rankingResult?.roleRankings
        ? p.rankingResult.roleRankings.reduce((sum, r) => sum + r.marketabilityScore, 0) / p.rankingResult.roleRankings.length
        : 0;
      return { project: p, avgScore, title: p.title };
    });

    // Sort by score descending
    projectScores.sort((a, b) => b.avgScore - a.avgScore);

    // Categorize projects
    const strongProjects = projectScores.filter(p => p.avgScore >= 7);
    const decentProjects = projectScores.filter(p => p.avgScore >= 5 && p.avgScore < 7);
    const weakProjects = projectScores.filter(p => p.avgScore < 5);

    let recommendation = "🎉 Analysis Complete!\n\n";
    recommendation += `📊 **Portfolio Recommendations:**\n\n`;

    // Recommendation based on total count
    if (projects.length > 4) {
      recommendation += `⚠️ **Too Many Projects**: You have ${projects.length} projects. Resumes should highlight 2-4 strongest projects (ideally 3).\n\n`;
    }

    // Strong projects (keep)
    if (strongProjects.length > 0) {
      recommendation += `✅ **KEEP (${strongProjects.length})** - Strong projects:\n`;
      strongProjects.forEach((p, i) => {
        const bestRoles = p.project.rankingResult?.bestFitRoles?.slice(0, 2).join(", ") || "Multiple roles";
        recommendation += `${i + 1}. "${p.title}" (${p.avgScore.toFixed(1)}/10) - ${bestRoles}\n`;
      });
      recommendation += `\n`;
    }

    // Decent projects (enhance or selective use)
    if (decentProjects.length > 0) {
      recommendation += `⚡ **ENHANCE (${decentProjects.length})** - Needs improvement:\n`;
      decentProjects.forEach((p, i) => {
        recommendation += `${i + 1}. "${p.title}" (${p.avgScore.toFixed(1)}/10) - Review suggestions above\n`;
      });
      recommendation += `\n`;
    }

    // Weak projects (drop)
    if (weakProjects.length > 0) {
      recommendation += `❌ **CONSIDER DROPPING (${weakProjects.length})** - Not adding value:\n`;
      weakProjects.forEach((p, i) => {
        recommendation += `${i + 1}. "${p.title}" (${p.avgScore.toFixed(1)}/10)\n`;
      });
      recommendation += `\n`;
    }

    // Final advice
    if (strongProjects.length >= 4) {
      recommendation += `💡 **Final Advice**: You have ${strongProjects.length} strong projects. Use your top 3-4 on your resume - select the most relevant for each job application.`;
    } else if (strongProjects.length >= 2) {
      recommendation += `💡 **Final Advice**: Use your ${strongProjects.length} strong project${strongProjects.length > 1 ? 's' : ''}. ${decentProjects.length > 0 ? `Consider enhancing ${Math.min(4 - strongProjects.length, decentProjects.length)} "decent" project(s) to build a stronger portfolio of 3-4 projects.` : 'This is a solid portfolio foundation.'}`;
    } else if (strongProjects.length + decentProjects.length >= 2) {
      recommendation += `💡 **Final Advice**: Enhance ${Math.min(4 - strongProjects.length, decentProjects.length)} "decent" project(s) following the suggestions above, then use your top 3-4.`;
    } else {
      recommendation += `💡 **Final Advice**: You need stronger projects. Consider building 2-3 substantial projects that demonstrate real technical depth and impact.`;
    }

    return recommendation;
  };

  const handleEmailSummary = async () => {
    if (!user?.email) {
      Alert.alert("Error", "No email address found");
      return;
    }

    if (rankedProjects.length === 0) {
      Alert.alert("Error", "No ranked projects to email");
      return;
    }

    setIsSendingEmail(true);
    try {
      const response = await fetch(FUNCTIONS_ENDPOINTS.SEND_EMAIL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          projectRankings: rankedProjects,
          targetRole: "General",
          candidateLevel: "Not specified",
        }),
      });

      if (response.ok) {
        Alert.alert("Email Sent!", `Your project rankings have been sent to ${user.email}`);
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("Email error:", error);
      Alert.alert("Error", "Failed to send email. Please try again later.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleReset = () => {
    setProjects([{ id: "1", title: "", description: "" }]);
    setMessages([]);
    setRankedProjects([]);
    setHasStartedRanking(false);
    setCurrentRankingIndex(0);
  };

  const handleAddAnother = () => {
    // Add a new project input without clearing chat history
    const newProject = { id: Date.now().toString(), title: "", description: "" };
    setProjects([newProject]);

    // Add a message showing new project input form
    const addMsg: ChatMessage = {
      id: `add-${Date.now()}`,
      type: "system",
      content: "📝 Add another project below:",
    };
    setMessages((prev) => [...prev, addMsg]);
  };

  const screenWidth = Dimensions.get("window").width;
  const isWeb = Platform.OS === "web";
  const maxWidth = isWeb && screenWidth > 1200 ? 1200 : screenWidth;

  const canRank = projects.some((p) => p.title.trim() && p.description.trim()) && !isRanking;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-black"
    >
      <View className="flex-1" style={{ maxWidth, alignSelf: "center", width: "100%" }}>
        <View className="px-6 pt-16 pb-4 border-b border-zinc-800">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-white text-2xl font-bold">My Projects</Text>
              <Text className="text-zinc-400 text-sm mt-1">
                AI-powered role matching • Recommend 2-4 best projects for resume
              </Text>
            </View>
            {rankedProjects.length > 0 && (
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={handleEmailSummary}
                  disabled={isSendingEmail}
                  className="bg-emerald-600 px-3 py-2 rounded-lg"
                >
                  {isSendingEmail ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Ionicons name="mail" size={16} color="white" />
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={handleReset} className="bg-zinc-800 px-3 py-2 rounded-lg">
                  <Ionicons name="refresh" size={16} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-6"
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 120 }}
        >
          {!hasStartedRanking ? (
            <View>
              <View className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
                <Text className="text-blue-400 text-center text-sm">
                  📝 Add up to {MAX_PROJECTS} projects below, then hit "Rank All Projects" to analyze them
                </Text>
                <Text className="text-blue-300 text-center text-xs mt-2">
                  💡 Tip: Resumes should highlight 2-4 strongest projects (ideally 3)
                </Text>
              </View>
              {projects.map((project, index) => (
                <View
                  key={project.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-4"
                >
                  <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-white font-semibold">Project {index + 1}</Text>
                    {projects.length > 1 && (
                      <TouchableOpacity onPress={() => removeProject(project.id)}>
                        <Ionicons name="trash-outline" size={20} color="#ef4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                  <TextInput
                    className="bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white mb-3"
                    placeholder="Project Title"
                    placeholderTextColor="#71717a"
                    value={project.title}
                    onChangeText={(value) => updateProject(project.id, "title", value)}
                  />
                  <TextInput
                    className="bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white min-h-[120px]"
                    placeholder="Describe your project: tech stack, problem solved, impact, scale..."
                    placeholderTextColor="#71717a"
                    value={project.description}
                    onChangeText={(value) => updateProject(project.id, "description", value)}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                  />
                </View>
              ))}
              {projects.length < MAX_PROJECTS && (
                <TouchableOpacity
                  onPress={addProject}
                  className="bg-zinc-900 border border-zinc-800 border-dashed rounded-xl p-4 mb-4 flex-row items-center justify-center"
                >
                  <Ionicons name="add-circle-outline" size={20} color="#3b82f6" />
                  <Text className="text-blue-400 ml-2 font-medium">Add Another Project</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View>
              {messages.map((message) => (
                <View key={message.id} className="mb-4">
                  {message.type === "system" && (
                    <View className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 max-w-[90%] self-center">
                      <Text className="text-blue-400 text-center text-sm">{message.content}</Text>
                    </View>
                  )}
                  {message.type === "user" && (
                    <View className="max-w-[85%] self-end">
                      <View className="bg-blue-600 rounded-2xl rounded-tr-sm px-4 py-3">
                        <Text className="text-white">{message.content}</Text>
                      </View>
                    </View>
                  )}
                  {message.type === "assistant" && (
                    <View className="max-w-[85%] self-start">
                      <View className="bg-zinc-900 border border-zinc-800 rounded-2xl rounded-tl-sm px-4 py-3">
                        <Text className="text-zinc-200">{message.content}</Text>
                      </View>
                      {message.project?.rankingResult && (
                        <View className="mt-3">
                          <ProjectRankingResults result={message.project.rankingResult} />
                        </View>
                      )}
                    </View>
                  )}
                </View>
              ))}
              {isRanking && (
                <View className="max-w-[85%] self-start">
                  <View className="bg-zinc-900 border border-zinc-800 rounded-2xl rounded-tl-sm px-4 py-3 flex-row items-center">
                    <ActivityIndicator size="small" color="#3b82f6" />
                    <Text className="text-zinc-400 ml-3">
                      Analyzing project {currentRankingIndex + 1}...
                    </Text>
                  </View>
                </View>
              )}
              {hasStartedRanking && !isRanking && projects.length > 0 && projects[0].title === "" && (
                <View className="mb-4">
                  {projects.map((project) => (
                    <View key={project.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-4">
                      <View className="mb-3">
                        <Text className="text-zinc-400 text-sm mb-2 font-medium">Project Title</Text>
                        <TextInput
                          className="bg-black border border-zinc-800 text-white px-4 py-3 rounded-lg"
                          placeholder="e.g., Budget Tracker App"
                          placeholderTextColor="#52525b"
                          value={project.title}
                          onChangeText={(value) => updateProject(project.id, "title", value)}
                        />
                      </View>
                      <View>
                        <Text className="text-zinc-400 text-sm mb-2 font-medium">Description & Tech Stack</Text>
                        <TextInput
                          className="bg-black border border-zinc-800 text-white px-4 py-3 rounded-lg"
                          placeholder="Describe what you built, technologies used (React, Node.js, PostgreSQL, etc.), key features..."
                          placeholderTextColor="#52525b"
                          value={project.description}
                          onChangeText={(value) => updateProject(project.id, "description", value)}
                          multiline
                          numberOfLines={6}
                          textAlignVertical="top"
                        />
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </ScrollView>
        <View className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-black border-t border-zinc-800">
          {!hasStartedRanking ? (
            <TouchableOpacity
              onPress={handleStartRanking}
              disabled={!canRank}
              className={`py-4 rounded-xl flex-row items-center justify-center ${
                canRank ? "bg-blue-600" : "bg-zinc-800"
              }`}
            >
              {isRanking ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Ionicons name="analytics" size={20} color="white" style={{ marginRight: 8 }} />
                  <Text className="text-white font-semibold text-base">
                    Rank All Projects ({projects.filter((p) => p.title.trim() && p.description.trim()).length})
                  </Text>
                </>
              )}
            </TouchableOpacity>
          ) : !isRanking && projects.length > 0 && projects[0].title === "" ? (
            <View className="gap-3">
              <TouchableOpacity
                onPress={handleStartRanking}
                disabled={!canRank}
                className={`py-4 rounded-xl flex-row items-center justify-center ${
                  canRank ? "bg-blue-600" : "bg-zinc-800"
                }`}
              >
                <Ionicons name="analytics" size={20} color="white" style={{ marginRight: 8 }} />
                <Text className="text-white font-semibold text-base">Rank Project</Text>
              </TouchableOpacity>
              <View className="bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 self-center">
                <Text className="text-zinc-400 text-xs">
                  ✅ {rankedProjects.length} {rankedProjects.length === 1 ? "project" : "projects"}{" "}
                  ranked • Saved to Dashboard
                </Text>
              </View>
            </View>
          ) : !isRanking ? (
            <View className="gap-3">
              <TouchableOpacity
                onPress={handleAddAnother}
                className="bg-blue-600 py-4 rounded-xl flex-row items-center justify-center"
              >
                <Ionicons name="add-circle-outline" size={20} color="white" style={{ marginRight: 8 }} />
                <Text className="text-white font-semibold text-base">Add Another Project</Text>
              </TouchableOpacity>
              <View className="bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 self-center">
                <Text className="text-zinc-400 text-xs">
                  ✅ {rankedProjects.length} {rankedProjects.length === 1 ? "project" : "projects"}{" "}
                  ranked • Saved to Dashboard
                </Text>
              </View>
            </View>
          ) : null}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
