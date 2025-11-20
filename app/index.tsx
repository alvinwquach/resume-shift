import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { HeroSection } from "../components/landing/HeroSection";
import { ProjectRankingDemoSection } from "../components/landing/ProjectRankingDemoSection";
import { ProjectRankingFeature } from "../components/landing/ProjectRankingFeature";
import { ResumeAnalysisDemoSection } from "../components/landing/ResumeAnalysisDemoSection";
import { ResumeAnalysisFeature } from "../components/landing/ResumeAnalysisFeature";
import { TestimonialsSection } from "../components/landing/TestimonialsSection";

export default function LandingPage() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(true);

  const bgColor = isDarkMode ? 'bg-[#0A0A0A]' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const mutedColor = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const cardBg = isDarkMode ? 'bg-zinc-900/50' : 'bg-white';
  const borderColor = isDarkMode ? 'border-zinc-800' : 'border-gray-200';
  const accentBg = isDarkMode ? 'bg-zinc-900' : 'bg-gray-50';

  return (
    <View className={`flex-1 ${bgColor}`}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className={`${bgColor} border-b ${borderColor} sticky top-0 z-50`}>
          <View className="px-6 py-4 max-w-7xl mx-auto w-full">
            <View className="flex-row items-center justify-between">
              <TouchableOpacity
                onPress={() => router.push("/")}
                className="flex-row items-center active:opacity-80"
              >
                <View className={`w-9 h-9 ${isDarkMode ? 'bg-blue-600' : 'bg-gray-900'} rounded-xl items-center justify-center mr-3`}>
                  <Ionicons name="document-text" size={20} color="white" />
                </View>
                <Text className={`${textColor} text-xl font-black`}>
                  Resume Pivot
                </Text>
              </TouchableOpacity>
              <View className="flex-row items-center gap-3">
                <TouchableOpacity
                  onPress={() => setIsDarkMode(!isDarkMode)}
                  className={`w-10 h-10 rounded-xl ${cardBg} border ${borderColor} items-center justify-center active:opacity-70`}
                >
                  <Ionicons name={isDarkMode ? "sunny" : "moon"} size={18} color={isDarkMode ? "#fbbf24" : "#6366f1"} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push("/login")}
                  className={`px-5 py-2.5 ${isDarkMode ? 'bg-blue-600' : 'bg-gray-900'} rounded-xl active:opacity-90`}
                >
                  <Text className="text-white font-semibold text-sm">Get Started</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View className={isDarkMode ? 'bg-black' : 'bg-white'}>
          <HeroSection isDarkMode={isDarkMode} textColor={textColor} mutedColor={mutedColor} />
        </View>
        <View className={isDarkMode ? 'bg-zinc-950' : 'bg-gray-50'}>
          <ResumeAnalysisFeature
            isDarkMode={isDarkMode}
            textColor={textColor}
            mutedColor={mutedColor}
            cardBg={cardBg}
            borderColor={borderColor}
          />
        </View>
        <View className={isDarkMode ? 'bg-black' : 'bg-white'}>
          <View className="px-6 py-24">
            <View className="max-w-7xl mx-auto">
              <View className="items-center mb-16">
                <Text className={`${textColor} text-4xl md:text-5xl font-black mb-6 text-center leading-tight`}>
                  Smart Portfolio Integration
                </Text>
                <Text className={`text-xl ${mutedColor} text-center max-w-3xl leading-relaxed`}>
                  Your portfolio projects are automatically detected, scored, and factored into your compatibility score—no manual entry required.
                </Text>
              </View>

              <View className="flex-row flex-wrap -mx-3">
                {/* Left Column - How it works */}
                <View className="w-full md:w-1/2 px-3 mb-6">
                  <View className={`${cardBg} border ${borderColor} rounded-3xl p-8 h-full shadow-lg`}>
                    <View className={`w-14 h-14 rounded-2xl ${isDarkMode ? 'bg-cyan-500' : 'bg-cyan-600'} items-center justify-center mb-6`}>
                      <Ionicons name="bulb" size={28} color="white" />
                    </View>
                    <Text className={`${textColor} text-2xl font-black mb-4`}>How it works</Text>
                    <Text className={`${mutedColor} leading-relaxed text-base mb-6`}>
                      When you analyze your resume, our AI automatically scans for a PROJECTS section, evaluates each project's technical depth, impact keywords, and tech stack breadth.
                    </Text>
                    <View className={`${isDarkMode ? 'bg-cyan-500/10' : 'bg-cyan-50'} border ${isDarkMode ? 'border-cyan-500/20' : 'border-cyan-200'} rounded-2xl p-5`}>
                      <Text className={`${textColor} font-bold text-lg mb-2`}>Score Adjustment</Text>
                      <Text className={`${mutedColor} text-base`}>
                        Your compatibility score adjusts by up to{' '}
                        <Text className={isDarkMode ? 'text-cyan-400 font-bold' : 'text-cyan-600 font-bold'}>+10 points</Text>{' '}
                        for strong portfolios that demonstrate execution quality.
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Right Column - Portfolio Tiers */}
                <View className="w-full md:w-1/2 px-3 mb-6">
                  <View className="space-y-4 h-full">
                    <View className={`${isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'} border ${isDarkMode ? 'border-emerald-500/30' : 'border-emerald-200'} rounded-2xl p-6 shadow-lg`}>
                      <View className="flex-row items-start mb-3">
                        <View className={`w-12 h-12 rounded-xl ${isDarkMode ? 'bg-emerald-500' : 'bg-emerald-600'} items-center justify-center mr-4 flex-shrink-0`}>
                          <Ionicons name="trending-up" size={24} color="white" />
                        </View>
                        <View className="flex-1">
                          <Text className={`${textColor} text-xl font-black mb-1`}>Strong Portfolio</Text>
                          <Text className={`${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} text-sm font-semibold`}>avg 7-10/10</Text>
                        </View>
                      </View>
                      <Text className={`${mutedColor} leading-relaxed`}>
                        <Text className="font-bold">+5 to +10 points</Text> boost. Demonstrates execution quality and validates claimed skills.
                      </Text>
                    </View>

                    <View className={`${isDarkMode ? 'bg-yellow-500/10' : 'bg-yellow-50'} border ${isDarkMode ? 'border-yellow-500/30' : 'border-yellow-200'} rounded-2xl p-6 shadow-lg`}>
                      <View className="flex-row items-start mb-3">
                        <View className={`w-12 h-12 rounded-xl ${isDarkMode ? 'bg-yellow-500' : 'bg-yellow-600'} items-center justify-center mr-4 flex-shrink-0`}>
                          <Ionicons name="remove" size={24} color="white" />
                        </View>
                        <View className="flex-1">
                          <Text className={`${textColor} text-xl font-black mb-1`}>Average Portfolio</Text>
                          <Text className={`${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'} text-sm font-semibold`}>avg 5-6/10</Text>
                        </View>
                      </View>
                      <Text className={`${mutedColor} leading-relaxed`}>
                        <Text className="font-bold">No adjustment.</Text> Portfolio is unremarkable.
                      </Text>
                    </View>

                    <View className={`${isDarkMode ? 'bg-red-500/10' : 'bg-red-50'} border ${isDarkMode ? 'border-red-500/30' : 'border-red-200'} rounded-2xl p-6 shadow-lg`}>
                      <View className="flex-row items-start mb-3">
                        <View className={`w-12 h-12 rounded-xl ${isDarkMode ? 'bg-red-500' : 'bg-red-600'} items-center justify-center mr-4 flex-shrink-0`}>
                          <Ionicons name="trending-down" size={24} color="white" />
                        </View>
                        <View className="flex-1">
                          <Text className={`${textColor} text-xl font-black mb-1`}>Weak Portfolio</Text>
                          <Text className={`${isDarkMode ? 'text-red-400' : 'text-red-600'} text-sm font-semibold`}>avg 1-4/10</Text>
                        </View>
                      </View>
                      <Text className={`${mutedColor} leading-relaxed`}>
                        <Text className="font-bold">-3 to -5 points</Text> penalty. May indicate gaps or lack of depth.
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* CTA Bottom */}
              <View className={`mt-6 ${isDarkMode ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10' : 'bg-gradient-to-r from-blue-50 to-purple-50'} rounded-2xl px-8 py-6 border ${isDarkMode ? 'border-blue-500/20' : 'border-blue-200'} shadow-lg`}>
                <View className="flex-row items-center">
                  <Ionicons name="information-circle" size={28} color={isDarkMode ? '#60a5fa' : '#3b82f6'} />
                  <Text className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} text-base font-semibold ml-4 flex-1`}>
                    Want deeper analysis? Visit the "My Projects" tab to rank projects with full AI scoring across multiple tech roles
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View className={isDarkMode ? 'bg-gradient-to-b from-blue-900/20 via-blue-950/40 to-blue-950/20' : 'bg-gradient-to-b from-blue-50 via-sky-50 to-white'}>
          <ResumeAnalysisDemoSection
            isDarkMode={isDarkMode}
            textColor={textColor}
            mutedColor={mutedColor}
            cardBg={cardBg}
            borderColor={borderColor}
            accentBg={accentBg}
          />
        </View>
        <View className={isDarkMode ? 'bg-zinc-950' : 'bg-white'}>
          <ProjectRankingFeature
            isDarkMode={isDarkMode}
            textColor={textColor}
            mutedColor={mutedColor}
            cardBg={cardBg}
            borderColor={borderColor}
          />
        </View>
        <View className={isDarkMode ? 'bg-gradient-to-b from-blue-900/20 via-blue-950/40 to-blue-950/20' : 'bg-gradient-to-b from-blue-50 via-sky-50 to-white'}>
          <ProjectRankingDemoSection
            isDarkMode={isDarkMode}
            textColor={textColor}
            mutedColor={mutedColor}
            cardBg={cardBg}
            borderColor={borderColor}
            accentBg={accentBg}
          />
        </View>
        <View className={isDarkMode ? 'bg-black' : 'bg-white'}>
          <View className="px-6 py-24">
            <View className="max-w-7xl mx-auto">
              <View className="items-center mb-16">
                <View className={`mb-4 px-4 py-2 ${isDarkMode ? 'bg-red-500/10' : 'bg-red-50'} border ${isDarkMode ? 'border-red-500/30' : 'border-red-200'} rounded-full`}>
                  <Text className={`${isDarkMode ? 'text-red-400' : 'text-red-600'} text-xs font-bold tracking-wide`}>
                    ⚠️ THE PROBLEM
                  </Text>
                </View>
                <Text className={`${textColor} text-4xl md:text-5xl font-black mb-4 text-center leading-tight`}>
                  Traditional job hunting{'\n'}doesn't work
                </Text>
                <Text className={`text-lg ${mutedColor} text-center max-w-2xl`}>
                  Most candidates waste months on strategies that never had a chance of working.
                </Text>
              </View>
              <View className="space-y-4">
                <View className={`${isDarkMode ? 'bg-zinc-900/50' : 'bg-gray-50'} border-l-4 ${isDarkMode ? 'border-red-500' : 'border-red-600'} rounded-r-xl p-6`}>
                  <View className="flex-row items-start gap-4">
                    <View className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-red-500/20' : 'bg-red-100'} items-center justify-center flex-shrink-0`}>
                      <Ionicons name="close-circle" size={20} color={isDarkMode ? '#ef4444' : '#dc2626'} />
                    </View>
                    <View className="flex-1">
                      <Text className={`${textColor} text-lg font-bold mb-2`}>No feedback loop</Text>
                      <Text className={`${mutedColor}`}>
                        Send 100+ applications. Get zero responses. Still have no idea which skills or projects actually matter for your target role.
                      </Text>
                    </View>
                  </View>
                </View>

                <View className={`${isDarkMode ? 'bg-zinc-900/50' : 'bg-gray-50'} border-l-4 ${isDarkMode ? 'border-red-500' : 'border-red-600'} rounded-r-xl p-6`}>
                  <View className="flex-row items-start gap-4">
                    <View className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-red-500/20' : 'bg-red-100'} items-center justify-center flex-shrink-0`}>
                      <Ionicons name="help-circle" size={20} color={isDarkMode ? '#ef4444' : '#dc2626'} />
                    </View>
                    <View className="flex-1">
                      <Text className={`${textColor} text-lg font-bold mb-2`}>Vague guidance</Text>
                      <Text className={`${mutedColor}`}>
                        Career advisors say "add keywords" and "build projects"—but never specify which ones or why they'd make a difference.
                      </Text>
                    </View>
                  </View>
                </View>

                <View className={`${isDarkMode ? 'bg-zinc-900/50' : 'bg-gray-50'} border-l-4 ${isDarkMode ? 'border-red-500' : 'border-red-600'} rounded-r-xl p-6`}>
                  <View className="flex-row items-start gap-4">
                    <View className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-red-500/20' : 'bg-red-100'} items-center justify-center flex-shrink-0`}>
                      <Ionicons name="time" size={20} color={isDarkMode ? '#ef4444' : '#dc2626'} />
                    </View>
                    <View className="flex-1">
                      <Text className={`${textColor} text-lg font-bold mb-2`}>Misallocated time</Text>
                      <Text className={`${mutedColor}`}>
                        Spend 3 months building an app, only to learn it's positioned at the wrong level or missing key technical depth.
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View className="mt-12">
                <View className="items-center mb-8">
                  <View className={`mb-4 px-4 py-2 ${isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'} border ${isDarkMode ? 'border-emerald-500/30' : 'border-emerald-200'} rounded-full`}>
                    <Text className={`${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} text-xs font-bold tracking-wide`}>
                      ✓ THE SOLUTION
                    </Text>
                  </View>
                  <Text className={`${textColor} text-3xl font-black text-center mb-2`}>
                    Data-driven career decisions
                  </Text>
                  <Text className={`${mutedColor} text-center`}>
                    Two AI agents that give you concrete, actionable insights
                  </Text>
                </View>
                <View className="flex-row flex-wrap -mx-2">
                  <View className="w-full md:w-1/2 px-2 mb-4">
                    <View className={`${isDarkMode ? 'bg-gradient-to-br from-blue-900/30 to-blue-950/10' : 'bg-gradient-to-br from-blue-50 to-blue-100'} border ${isDarkMode ? 'border-blue-500/30' : 'border-blue-200'} rounded-2xl p-8 h-full`}>
                      <View className={`w-14 h-14 rounded-2xl ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'} items-center justify-center mb-4`}>
                        <Ionicons name="document-text" size={28} color="white" />
                      </View>
                      <Text className={`${textColor} text-2xl font-black mb-3`}>Resume Analysis Agent</Text>
                      <Text className={`${mutedColor} leading-relaxed mb-4`}>
                        Paste any job posting. Get your compatibility score with automatic portfolio boost, skill gaps, missing keywords, and project ideas with impact estimates.
                      </Text>
                      <View className="space-y-2">
                        <View className="flex-row items-center">
                          <View className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'} mr-2`} />
                          <Text className={`${mutedColor} text-sm`}>Portfolio-adjusted scoring (auto-detects projects)</Text>
                        </View>
                        <View className="flex-row items-center">
                          <View className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'} mr-2`} />
                          <Text className={`${mutedColor} text-sm`}>Technical skills matching</Text>
                        </View>
                        <View className="flex-row items-center">
                          <View className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'} mr-2`} />
                          <Text className={`${mutedColor} text-sm`}>Experience gap identification</Text>
                        </View>
                        <View className="flex-row items-center">
                          <View className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'} mr-2`} />
                          <Text className={`${mutedColor} text-sm`}>Multiple resume version management</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View className="w-full md:w-1/2 px-2 mb-4">
                    <View className={`${isDarkMode ? 'bg-gradient-to-br from-purple-900/30 to-purple-950/10' : 'bg-gradient-to-br from-purple-50 to-purple-100'} border ${isDarkMode ? 'border-purple-500/30' : 'border-purple-200'} rounded-2xl p-8 h-full`}>
                      <View className={`w-14 h-14 rounded-2xl ${isDarkMode ? 'bg-purple-500' : 'bg-purple-600'} items-center justify-center mb-4`}>
                        <Ionicons name="analytics" size={28} color="white" />
                      </View>
                      <Text className={`${textColor} text-2xl font-black mb-3`}>Project Ranking Agent</Text>
                      <Text className={`${mutedColor} leading-relaxed mb-4`}>
                        Enter your projects. See marketability scores (1-10) across Frontend, Backend, AI/LLM, and Data roles. Get KEEP/ENHANCE/DROP recommendations.
                      </Text>
                      <View className="space-y-2">
                        <View className="flex-row items-center">
                          <View className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-purple-400' : 'bg-purple-600'} mr-2`} />
                          <Text className={`${mutedColor} text-sm`}>Multi-role marketability scoring</Text>
                        </View>
                        <View className="flex-row items-center">
                          <View className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-purple-400' : 'bg-purple-600'} mr-2`} />
                          <Text className={`${mutedColor} text-sm`}>Level-appropriate assessment</Text>
                        </View>
                        <View className="flex-row items-center">
                          <View className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-purple-400' : 'bg-purple-600'} mr-2`} />
                          <Text className={`${mutedColor} text-sm`}>Enhancement suggestions with effort</Text>
                        </View>
                      </View>
                    </View>
                  </View>                  
                </View>
              </View>
            </View>
          </View>
        </View>
        <View className={isDarkMode ? 'bg-zinc-950' : 'bg-gray-50'}>
          <View className="px-6 py-24">
            <View className="max-w-4xl mx-auto">
              <View className="items-center mb-16">
                <View className={`mb-4 px-4 py-2 ${isDarkMode ? 'bg-gradient-to-r from-indigo-500/10 to-blue-500/10' : 'bg-gradient-to-r from-indigo-50 to-blue-50'} border ${isDarkMode ? 'border-indigo-500/30' : 'border-indigo-200'} rounded-full`}>
                  <Text className={`${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} text-xs font-bold tracking-wide`}>
                    → HOW IT WORKS
                  </Text>
                </View>
                <Text className={`${textColor} text-4xl md:text-5xl font-black mb-4 text-center leading-tight`}>
                  Three steps to clarity
                </Text>
                <Text className={`text-lg ${mutedColor} text-center max-w-2xl`}>
                  Get actionable insights in minutes, not months
                </Text>
              </View>
              <View className="relative">
                <View className={`absolute left-6 top-0 bottom-0 w-0.5 ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-300'}`} />
                <View className="relative mb-8 flex-row">
                  <View className={`w-12 h-12 rounded-full ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'} items-center justify-center z-10`}>
                    <Text className="text-white font-black text-xl">1</Text>
                  </View>
                  <View className="flex-1 ml-6">
                    <View className={`${cardBg} border ${borderColor} rounded-2xl p-6`}>
                      <Text className={`${textColor} text-2xl font-bold mb-3`}>Analyze</Text>
                      <Text className={`${mutedColor} leading-relaxed mb-4`}>
                        Upload one or multiple resume versions and paste a job posting. Our AI analyzes your compatibility across multiple dimensions, automatically detects portfolio projects, and adjusts your score based on project quality.
                      </Text>
                      <View className={`${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'} rounded-lg px-3 py-2`}>
                        <Text className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} text-sm font-semibold`}>
                          ⚡ Results in ~10 seconds + portfolio boost
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View className="relative mb-8 flex-row">
                  <View className={`w-12 h-12 rounded-full ${isDarkMode ? 'bg-purple-500' : 'bg-purple-600'} items-center justify-center z-10`}>
                    <Text className="text-white font-black text-xl">2</Text>
                  </View>
                  <View className="flex-1 ml-6">
                    <View className={`${cardBg} border ${borderColor} rounded-2xl p-6`}>
                      <Text className={`${textColor} text-2xl font-bold mb-3`}>Optimize</Text>
                      <Text className={`${mutedColor} leading-relaxed mb-4`}>
                        Rank your projects to see which ones strengthen your candidacy. Drop weak projects, enhance mid-tier ones, keep the winners.
                      </Text>
                      <View className={`${isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50'} rounded-lg px-3 py-2`}>
                        <Text className={`${isDarkMode ? 'text-purple-400' : 'text-purple-600'} text-sm font-semibold`}>
                          📊 Multi-role scoring (1-10)
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View className="relative flex-row">
                  <View className={`w-12 h-12 rounded-full ${isDarkMode ? 'bg-emerald-500' : 'bg-emerald-600'} items-center justify-center z-10`}>
                    <Text className="text-white font-black text-xl">3</Text>
                  </View>
                  <View className="flex-1 ml-6">
                    <View className={`${cardBg} border ${borderColor} rounded-2xl p-6`}>
                      <Text className={`${textColor} text-2xl font-bold mb-3`}>Execute</Text>
                      <Text className={`${mutedColor} leading-relaxed mb-4`}>
                        Follow concrete recommendations with time estimates and impact scores. Build what matters, skip what doesn't.
                      </Text>
                      <View className={`${isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'} rounded-lg px-3 py-2`}>
                        <Text className={`${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} text-sm font-semibold`}>
                          🎯 Prioritized action items
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View className={isDarkMode ? 'bg-gradient-to-b from-pink-950/30 via-rose-950/20 to-black' : 'bg-gradient-to-b from-purple-50 via-pink-50 to-white'}>
          <TestimonialsSection
            isDarkMode={isDarkMode}
            textColor={textColor}
            mutedColor={mutedColor}
            cardBg={cardBg}
            borderColor={borderColor}
            accentBg={accentBg}
          />
        </View>
        <View className={`py-24 relative overflow-hidden ${isDarkMode ? 'bg-gradient-to-b from-black via-zinc-950 to-black' : 'bg-gradient-to-b from-white via-gray-50 to-white'}`}>
          <View className={`absolute top-0 left-1/4 w-96 h-96 ${isDarkMode ? 'bg-blue-600/10' : 'bg-blue-400/20'} rounded-full blur-3xl`} />
          <View className={`absolute bottom-0 right-1/4 w-96 h-96 ${isDarkMode ? 'bg-purple-600/10' : 'bg-purple-400/20'} rounded-full blur-3xl`} />
          <View className="px-6 max-w-4xl mx-auto relative z-10">
            <View className="items-center mb-12">
              <Text className={`${textColor} text-5xl md:text-6xl font-black mb-6 text-center leading-tight tracking-tight`}>
                Stop guessing.{'\n'}Start building.
              </Text>
              <Text className={`text-xl ${mutedColor} text-center max-w-2xl leading-relaxed`}>
                Know exactly which projects to showcase and which skills to develop for your dream tech role.
              </Text>
            </View>
            <View className="items-center mb-8">
              <TouchableOpacity
                onPress={() => router.push("/login")}
                className={`${isDarkMode ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-blue-600 to-purple-600'} rounded-2xl px-12 py-5 active:opacity-90 shadow-2xl flex-row items-center mb-4`}
                activeOpacity={0.9}
              >
                <Text className="text-white font-bold text-lg mr-3">
                  Get Started Free
                </Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </TouchableOpacity>
              <View className="flex-row items-center gap-4">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="checkmark-circle" size={16} color={isDarkMode ? '#4ade80' : '#16a34a'} />
                  <Text className={`${mutedColor} text-sm font-medium`}>No credit card</Text>
                </View>
                <View className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-zinc-700' : 'bg-gray-300'}`} />
                <View className="flex-row items-center gap-2">
                  <Ionicons name="checkmark-circle" size={16} color={isDarkMode ? '#4ade80' : '#16a34a'} />
                  <Text className={`${mutedColor} text-sm font-medium`}>Free forever</Text>
                </View>
              </View>
            </View>
            <View className="flex-row flex-wrap justify-center gap-6 max-w-3xl mx-auto">
              <View className={`${cardBg} border ${borderColor} rounded-xl px-6 py-4 shadow-lg flex-1 min-w-[200px]`}>
                <View className="items-center">
                  <View className={`w-12 h-12 rounded-xl ${isDarkMode ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-blue-400 to-cyan-400'} items-center justify-center mb-3`}>
                    <Ionicons name="document-text" size={24} color="white" />
                  </View>
                  <Text className={`${textColor} font-bold text-center mb-1`}>Resume Analysis</Text>
                  <Text className={`${mutedColor} text-xs text-center`}>Portfolio-adjusted scoring</Text>
                </View>
              </View>
              <View className={`${cardBg} border ${borderColor} rounded-xl px-6 py-4 shadow-lg flex-1 min-w-[200px]`}>
                <View className="items-center">
                  <View className={`w-12 h-12 rounded-xl ${isDarkMode ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-purple-400 to-pink-400'} items-center justify-center mb-3`}>
                    <Ionicons name="layers" size={24} color="white" />
                  </View>
                  <Text className={`${textColor} font-bold text-center mb-1`}>Multiple Versions</Text>
                  <Text className={`${mutedColor} text-xs text-center`}>Manage resumes per role</Text>
                </View>
              </View>
              <View className={`${cardBg} border ${borderColor} rounded-xl px-6 py-4 shadow-lg flex-1 min-w-[200px]`}>
                <View className="items-center">
                  <View className={`w-12 h-12 rounded-xl ${isDarkMode ? 'bg-gradient-to-br from-emerald-500 to-teal-500' : 'bg-gradient-to-br from-emerald-400 to-teal-400'} items-center justify-center mb-3`}>
                    <Ionicons name="flash" size={24} color="white" />
                  </View>
                  <Text className={`${textColor} font-bold text-center mb-1`}>Instant Results</Text>
                  <Text className={`${mutedColor} text-xs text-center`}>Analysis in ~10 seconds</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
