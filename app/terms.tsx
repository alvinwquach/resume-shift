import { Card, LegalSection, PageLayout } from "@/components";
import { Text, View } from "react-native";

const permittedUse = [
  "Upload and analyze your resumes",
  "Compare your resume against job postings",
  "Receive feedback and improvement suggestions",
  "Access and manage your account",
];

const prohibitedUse = [
  "Use the Services for any illegal purpose",
  "Upload malicious code or viruses",
  "Attempt to reverse engineer or copy our AI models",
  "Share your account credentials with others",
  "Scrape or automate access to the Services",
  "Upload content that violates others' rights or is offensive",
];

const userContentLicense = [
  "Store and process your User Content",
  "Use AI to analyze your User Content",
  "Generate feedback and recommendations based on your User Content",
];

const disclaimers = [
  "We do not guarantee that our AI analysis is 100% accurate",
  "We do not guarantee that using our Services will result in job offers",
  "We do not warrant that the Services will be uninterrupted or error-free",
  "We are not responsible for the content of external job postings",
];

export default function TermsOfServicePage() {
  return (
    <PageLayout>
      <Text className="text-white text-4xl font-bold mb-4">
        Terms of Service
      </Text>
      <Text className="text-zinc-500 text-sm mb-12">
        Last updated: January 2025
      </Text>
      <View className="mb-10">
        <Text className="text-zinc-400 text-base leading-relaxed mb-4">
          Welcome to Resume Pivot! These Terms of Service ("Terms") govern your
          access to and use of our application, services, and website
          (collectively, the "Services").
        </Text>
        <Text className="text-zinc-400 text-base leading-relaxed">
          By accessing or using our Services, you agree to be bound by these
          Terms. If you disagree with any part of the terms, you may not access
          the Services.
        </Text>
      </View>
      <LegalSection title="1. Acceptance of Terms">
        <Text className="text-zinc-400 text-base leading-relaxed">
          By creating an account or using Resume Pivot, you confirm that you are
          have the legal capacity to enter into these
          Terms. If you are using the Services on behalf of an organization, you
          represent that you have the authority to bind that organization to
          these Terms.
        </Text>
      </LegalSection>
      <LegalSection title="2. Use of Services">
        <LegalSection subtitle="Permitted Use">
          <Text className="text-zinc-400 text-base leading-relaxed mb-4">
            You may use our Services to:
          </Text>
          <Card className="mb-6">
            {permittedUse.map((item, index) => (
              <Text
                key={index}
                className={`text-zinc-300 text-sm ${index < permittedUse.length - 1 ? "mb-2" : ""}`}
              >
                • {item}
              </Text>
            ))}
          </Card>
        </LegalSection>
        <LegalSection subtitle="Prohibited Use">
          <Text className="text-zinc-400 text-base leading-relaxed mb-4">
            You agree not to:
          </Text>
          <Card>
            {prohibitedUse.map((item, index) => (
              <Text
                key={index}
                className={`text-zinc-300 text-sm ${index < prohibitedUse.length - 1 ? "mb-2" : ""}`}
              >
                • {item}
              </Text>
            ))}
          </Card>
        </LegalSection>
      </LegalSection>
      <LegalSection title="3. User Content">
        <Text className="text-zinc-400 text-base leading-relaxed mb-4">
          You retain all rights to the content you upload to ResumeShift,
          including your resume and any other materials ("User Content"). By
          uploading User Content, you grant us a limited license to:
        </Text>
        <Card className="mb-4">
          {userContentLicense.map((item, index) => (
            <Text
              key={index}
              className={`text-zinc-300 text-sm ${index < userContentLicense.length - 1 ? "mb-2" : ""}`}
            >
              • {item}
            </Text>
          ))}
        </Card>
        <Text className="text-zinc-400 text-base leading-relaxed">
          We will not share, sell, or use your User Content for any purpose
          other than providing our Services to you. We do not use your resume
          data to train our AI models.
        </Text>
      </LegalSection>
      <LegalSection title="4. Intellectual Property">
        <Text className="text-zinc-400 text-base leading-relaxed mb-4">
          The Services and all associated content, features, and functionality
          are owned by ResumeShift and are protected by international copyright,
          trademark, and other intellectual property laws.
        </Text>
        <Text className="text-zinc-400 text-base leading-relaxed">
          You may not copy, modify, distribute, sell, or lease any part of our
          Services without our express written permission.
        </Text>
      </LegalSection>
      <LegalSection title="5. Account Termination">
        <Text className="text-zinc-400 text-base leading-relaxed mb-4">
          You may terminate your account at any time by contacting us or using
          the account deletion feature in the app.
        </Text>
        <Text className="text-zinc-400 text-base leading-relaxed">
          We reserve the right to suspend or terminate your access to the
          Services at our discretion, without notice, for conduct that we
          believe violates these Terms or is harmful to other users, us, or
          third parties, or for any other reason.
        </Text>
      </LegalSection>
      <LegalSection title="6. Disclaimer of Warranties">
        <Text className="text-zinc-400 text-base leading-relaxed mb-4">
          THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES
          OF ANY KIND, EITHER EXPRESS OR IMPLIED.
        </Text>
        <Card>
          {disclaimers.map((item, index) => (
            <Text
              key={index}
              className={`text-zinc-300 text-sm ${index < disclaimers.length - 1 ? "mb-2" : ""}`}
            >
              • {item}
            </Text>
          ))}
        </Card>
      </LegalSection>
      <LegalSection title="7. Limitation of Liability">
        <Text className="text-zinc-400 text-base leading-relaxed">
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, RESUMESHIFT SHALL NOT BE LIABLE
          FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
          DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY
          OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE
          LOSSES.
        </Text>
      </LegalSection>
      <LegalSection title="8. Changes to Terms">
        <Text className="text-zinc-400 text-base leading-relaxed">
          We reserve the right to modify these Terms at any time. If we make
          material changes, we will notify you by email or through the Services.
          Your continued use of the Services after such modifications constitutes
          your acceptance of the updated Terms.
        </Text>
      </LegalSection>
      <LegalSection title="9. Governing Law">
        <Text className="text-zinc-400 text-base leading-relaxed">
          These Terms shall be governed by and construed in accordance with the
          laws of the United States, without regard to its conflict of law
          provisions.
        </Text>
      </LegalSection>
      <LegalSection title="10. Contact Information">
        <Text className="text-zinc-400 text-base leading-relaxed mb-4">
          If you have any questions about these Terms, please contact us at:
        </Text>
        <Card>
          <Text className="text-zinc-300 text-sm">legal@resumeshift.com</Text>
        </Card>
      </LegalSection>
    </PageLayout>
  );
}
