import { FeatureList, PageLayout, Section } from "@/components";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

const jobFitAnalysisFeatures = [
  { icon: "", title: "Deep content analysis", description: "" },
  { icon: "", title: "Skills matching algorithm", description: "" },
  { icon: "", title: "Experience level assessment", description: "" },
  { icon: "", title: "Keyword optimization detection", description: "" },
];

const compatibilityScoreFeatures = [
  { icon: "", title: "0-100 percentage score", description: "" },
  { icon: "", title: "Clear qualification indicators", description: "" },
  { icon: "", title: "Strength and weakness breakdown", description: "" },
  { icon: "", title: "Competitive positioning insights", description: "" },
];

const improvementSuggestionsFeatures = [
  { icon: "", title: "Missing skills identification", description: "" },
  { icon: "", title: "Experience gap analysis", description: "" },
  { icon: "", title: "Keyword recommendations", description: "" },
  { icon: "", title: "Formatting and structure tips", description: "" },
];

const securityFeatures = [
  { icon: "", title: "End-to-end encryption", description: "" },
  { icon: "", title: "No third-party data sharing", description: "" },
  { icon: "", title: "Secure cloud storage", description: "" },
  { icon: "", title: "GDPR compliant", description: "" },
];

const easeOfUseFeatures = [
  { icon: "", title: "Drag-and-drop resume upload", description: "" },
  { icon: "", title: "Quick job link analysis", description: "" },
  { icon: "", title: "Instant results", description: "" },
  { icon: "", title: "Mobile-friendly interface", description: "" },
];

export default function FeaturesPage() {
  const router = useRouter();

  return (
    <PageLayout>
      <Text className="text-white text-4xl font-bold mb-4">Features</Text>
      <Text className="text-zinc-400 text-lg leading-relaxed mb-12">
        Everything you need to pivot your resume and land your dream job.
      </Text>
      <View className="flex-row flex-wrap -mx-2">
        <View className="w-1/2 px-2">
          <Section
            icon="sparkles"
            title="AI-Powered Job Fit Analysis"
            subtitle="Our advanced AI analyzes your resume against any public job posting to determine how well you match the role's requirements."
          >
            <FeatureList features={jobFitAnalysisFeatures} />
          </Section>
        </View>
        <View className="w-1/2 px-2">
          <Section
            icon="analytics"
            title="Instant Compatibility Score"
            subtitle="Get a clear, quantified score showing how well your resume matches the job requirements. No more guessing if you're qualified."
          >
            <FeatureList features={compatibilityScoreFeatures} />
          </Section>
        </View>
        <View className="w-1/2 px-2">
          <Section
            icon="bulb"
            title="Personalized Suggestions"
            subtitle="Receive specific, actionable feedback tailored to each job application. Know exactly what to change to improve your chances."
          >
            <FeatureList features={improvementSuggestionsFeatures} />
          </Section>
        </View>
        <View className="w-1/2 px-2">
          <Section
            icon="shield-checkmark"
            title="Secure and Private"
            subtitle="Your resume and personal data are encrypted and protected. We never share your information with third parties or use it for training."
          >
            <FeatureList features={securityFeatures} />
          </Section>
        </View>
      </View>

      <View className="mt-8 bg-zinc-900 border border-zinc-800 rounded-xl p-8">
        <Text className="text-white text-2xl font-bold mb-3">
          Ready to get started?
        </Text>
        <Text className="text-zinc-400 text-base mb-6 leading-relaxed">
          Start optimizing your resume today and increase your chances of
          landing your dream job.
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/login")}
          className="bg-white rounded-lg px-6 py-4 active:opacity-80"
        >
          <Text className="text-black font-semibold text-base text-center">
            Get started for free
          </Text>
        </TouchableOpacity>
      </View>
    </PageLayout>
  );
}
