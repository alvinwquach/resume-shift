import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { faqs } from "./faq.data";

interface FAQSectionProps {
  isDarkMode: boolean;
  textColor: string;
  mutedColor: string;
  cardBg: string;
  borderColor: string;
}

export function FAQSection({ isDarkMode, textColor, mutedColor, cardBg, borderColor }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <View className="px-6 py-20">
      <Text className={`text-5xl font-black text-center mb-4 ${textColor}`}>
        Frequently asked questions
      </Text>
      <Text className={`text-xl text-center mb-16 ${mutedColor}`}>
        Everything you need to know
      </Text>
      <View className="max-w-3xl mx-auto">
        {faqs.map((faq, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => setOpenIndex(openIndex === idx ? null : idx)}
            className={`${cardBg} border ${borderColor} rounded-2xl p-6 mb-4`}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center justify-between">
              <Text className={`text-lg font-bold flex-1 pr-4 ${textColor}`}>
                {faq.question}
              </Text>
              <Ionicons
                name={openIndex === idx ? "chevron-up" : "chevron-down"}
                size={24}
                color={isDarkMode ? "#9ca3af" : "#6b7280"}
              />
            </View>
            {openIndex === idx && (
              <Text className={`text-base leading-6 mt-4 ${mutedColor}`}>
                {faq.answer}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
