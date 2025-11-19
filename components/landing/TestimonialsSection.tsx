import { Text, View } from "react-native";
import { testimonials } from "./testimonials.data";

interface TestimonialsSectionProps {
  isDarkMode: boolean;
  textColor: string;
  mutedColor: string;
  cardBg: string;
  borderColor: string;
  accentBg: string;
}

export function TestimonialsSection({ isDarkMode, textColor, mutedColor, cardBg, borderColor, accentBg }: TestimonialsSectionProps) {
  return (
    <View className={`px-6 py-20 ${accentBg}`}>
      <Text className={`text-5xl font-black text-center mb-4 ${textColor}`}>
        What users are saying
      </Text>
      <Text className={`text-xl text-center mb-16 ${mutedColor}`}>
        Real feedback from real users
      </Text>
      <View className="flex-row flex-wrap justify-center gap-4 max-w-6xl mx-auto">
        {testimonials.map((testimonial, idx) => (
          <View
            key={idx}
            className={`${cardBg} border ${borderColor} rounded-2xl p-6 w-full md:w-[48%] lg:w-[31%]`}
          >
            <View className="flex-row items-center mb-4">
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: testimonial.color }}
              >
                <Text className="text-white font-bold text-lg">
                  {testimonial.name.charAt(0)}
                </Text>
              </View>
              <Text className={`font-bold ${textColor}`}>{testimonial.name}</Text>
            </View>
            <Text className={`text-base leading-6 ${mutedColor}`}>
              {testimonial.text}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
