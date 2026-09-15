"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { Recycle, Wallet, Leaf, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui";
import { useRouter } from "next/navigation";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

/**
 * Onboarding Slides
 * Interactive carousel introducing WasteFi features
 */

interface Slide {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
}

const slides: Slide[] = [
  {
    icon: Recycle,
    title: "Collect. Earn. Impact.",
    description: "Turn waste into income. Get paid for every kilogram of recyclable material you collect.",
    color: "text-[var(--primary)]",
  },
  {
    icon: Wallet,
    title: "Easy Mobile Payments",
    description: "Instant payments to your mobile money account or digital wallet. Cash out anytime.",
    color: "text-[var(--info)]",
  },
  {
    icon: Leaf,
    title: "Environmental Impact",
    description: "Track your CO₂ reduction and see the real difference you're making for the planet.",
    color: "text-[var(--success)]",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Earnings",
    description: "The more you collect, the more you earn. Build a sustainable income stream.",
    color: "text-[var(--warning)]",
  },
];

export function OnboardingSlides() {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const isLastSlide = activeIndex === slides.length - 1;

  const handleGetStarted = () => {
    router.push("/register");
  };

  const handleSkip = () => {
    router.push("/login");
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--background)]">
      {/* Skip Button */}
      <div className="flex justify-end p-4">
        <Button variant="ghost" size="sm" onClick={handleSkip}>
          Skip
        </Button>
      </div>

      {/* Slides */}
      <div className="flex-1 flex items-center justify-center px-6">
        <Swiper
          modules={[Pagination, Navigation]}
          pagination={{ clickable: true }}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className="w-full max-w-md"
        >
          {slides.map((slide, index) => {
            const Icon = slide.icon;
            return (
              <SwiperSlide key={index}>
                <div className="flex flex-col items-center text-center space-y-6 pb-16">
                  <div className={`w-32 h-32 rounded-full bg-[var(--muted)] flex items-center justify-center ${slide.color}`}>
                    <Icon className="w-20 h-20" />
                  </div>
                  <h2 className="heading-2">{slide.title}</h2>
                  <p className="body-large text-[var(--muted-foreground)] max-w-sm">
                    {slide.description}
                  </p>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* Action Buttons */}
      <div className="p-6 space-y-3">
        {isLastSlide ? (
          <>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
            <Button variant="outline" size="lg" fullWidth onClick={handleSkip}>
              I Already Have an Account
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            size="lg"
            fullWidth
            onClick={() => {
              const nextIndex = activeIndex + 1;
              if (nextIndex < slides.length) {
                setActiveIndex(nextIndex);
              }
            }}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
