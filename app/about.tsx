import { Button, Card, PageLayout, Section } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";

export default function AboutPage() {
  const router = useRouter();

  return (
    <PageLayout>
      <Text className="text-white text-4xl font-bold mb-4">
        About ResumeShift
      </Text>
      <Text className="text-zinc-400 text-lg leading-relaxed mb-12">
        We believe everyone deserves a fair shot at their dream job.
      </Text>
      <Section icon="rocket" title="Our Mission">
        <Text className="text-zinc-400 text-base leading-relaxed mb-4">
          Job hunting is hard enough without wondering if your resume is even
          being seen. We built ResumeShift to give job seekers the clarity and
          confidence they need to succeed.
        </Text>
        <Text className="text-zinc-400 text-base leading-relaxed">
          Our AI-powered platform analyzes your resume against real job
          postings, providing instant feedback on how well you match the role
          and specific suggestions for improvement. No more guessing, no more
          wondering—just clear, actionable insights.
        </Text>
      </Section>
      <Section icon="book" title="Our Story">
        <Text className="text-zinc-400 text-base leading-relaxed mb-4">
          ResumeShift was born from a simple frustration: applying to dozens of
          jobs without knowing if your resume even makes it past the first
          screening.
        </Text>
        <Text className="text-zinc-400 text-base leading-relaxed mb-4">
          We've been there. Tailoring resumes for every application, wondering
          if the keywords are right, if the experience is highlighted properly,
          if you're even qualified enough to apply.
        </Text>
        <Text className="text-zinc-400 text-base leading-relaxed">
          So we built a tool that takes the guesswork out of the process. Upload
          your resume, paste a job link, and get an instant compatibility score
          with personalized feedback. It's that simple.
        </Text>
      </Section>
      <View className="mb-12">
        <Text className="text-white text-2xl font-bold mb-6">Our Values</Text>
        <Card className="mb-4">
          <View className="flex-row items-start mb-2">
            <Ionicons name="people" size={20} color="#fff" />
            <Text className="text-white text-lg font-semibold ml-3">
              Accessibility for All
            </Text>
          </View>
          <Text className="text-zinc-400 text-sm leading-relaxed ml-8">
            We believe powerful career tools shouldn't be locked behind
            paywalls. That's why ResumeShift is completely free.
          </Text>
        </Card>
        <Card className="mb-4">
          <View className="flex-row items-start mb-2">
            <Ionicons name="shield-checkmark" size={20} color="#fff" />
            <Text className="text-white text-lg font-semibold ml-3">
              Privacy First
            </Text>
          </View>
          <Text className="text-zinc-400 text-sm leading-relaxed ml-8">
            Your resume contains sensitive personal information. We encrypt
            everything and never share your data with third parties.
          </Text>
        </Card>
        <Card className="mb-4">
          <View className="flex-row items-start mb-2">
            <Ionicons name="bulb" size={20} color="#fff" />
            <Text className="text-white text-lg font-semibold ml-3">
              Honest Feedback
            </Text>
          </View>
          <Text className="text-zinc-400 text-sm leading-relaxed ml-8">
            We give you real, actionable insights—not inflated scores or vague
            suggestions. You deserve transparency.
          </Text>
        </Card>
        <Card>
          <View className="flex-row items-start mb-2">
            <Ionicons name="trending-up" size={20} color="#fff" />
            <Text className="text-white text-lg font-semibold ml-3">
              Continuous Improvement
            </Text>
          </View>
          <Text className="text-zinc-400 text-sm leading-relaxed ml-8">
            We're constantly improving our AI and adding features based on your
            feedback. Your success is our success.
          </Text>
        </Card>
      </View>
      <Section icon="heart" title="Built by Job Seekers">
        <Text className="text-zinc-400 text-base leading-relaxed mb-4">
          We're a small team of engineers and designers who understand the job
          search struggle firsthand. We've applied to hundreds of jobs, gotten
          rejected more times than we can count, and learned what actually
          works.
        </Text>
        <Text className="text-zinc-400 text-base leading-relaxed">
          ResumeShift is the tool we wish we had when we were job hunting. Now
          we're making it available to everyone, for free.
        </Text>
      </Section>
      <Card variant="default" padding="lg" className="bg-white">
        <Text className="text-black text-2xl font-bold mb-3">
          Join thousands of job seekers
        </Text>
        <Text className="text-zinc-600 text-base mb-6 leading-relaxed">
          Start optimizing your resume today and take the guesswork out of your
          job search.
        </Text>
        <Button className="bg-black" onPress={() => router.push("/login")}>
          <Text className="text-white font-semibold text-base text-center">
            Get started for free
          </Text>
        </Button>
      </Card>
    </PageLayout>
  );
}
