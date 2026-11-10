"use client";

import { useState } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { Recycle, Coins, ShieldCheck, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/brand/Logo";

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

// Only describe what the app does today: people evaluating it will check.
const slides: Slide[] = [
  {
    icon: Recycle,
    title: "Collect. Earn. Impact.",
    description:
      "Turn waste into income. Deliver sorted recyclables to a collection point and get paid by the kilogram.",
    color: "text-[var(--primary)]",
  },
  {
    icon: Coins,
    title: "Paid on Stellar",
    description:
      "When the collection point approves your delivery, it is recorded on the Stellar blockchain and you are paid in WASTE.",
    color: "text-[var(--info)]",
  },
  {
    icon: ShieldCheck,
    title: "Proof You Can Check",
    description:
      "Every payment links to its transaction, so you, the collection point and anyone else can verify it.",
    color: "text-[var(--success)]",
  },
  {
    icon: TrendingUp,
    title: "Build Your Record",
    description:
      "Each verified delivery adds to your reputation on-chain. The more you collect, the more you earn.",
    color: "text-[var(--warning)]",
  },
];

export function OnboardingSlides() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
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
      <div className="flex items-center justify-between p-4">
        <Link
          href="/stats"
          className="text-sm font-medium text-[var(--primary)] underline underline-offset-4"
        >
          See live stats
        </Link>
        <Button variant="ghost" size="sm" onClick={handleSkip}>
          Skip
        </Button>
      </div>

      {/* Slides */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
        <Logo height={36} priority />
        <Swiper
          modules={[Pagination, Navigation]}
          pagination={{ clickable: true }}
          onSwiper={setSwiper}
          onSlideChange={(instance) => setActiveIndex(instance.activeIndex)}
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
              variant="cta"
              size="lg"
              fullWidth
              onClick={handleGetStarted}
            >
              Create an Account
            </Button>
            <Button variant="outline" size="lg" fullWidth onClick={handleSkip}>
              Sign In or Try the Demo
            </Button>
          </>
        ) : (
          <Button
            variant="cta"
            size="lg"
            fullWidth
            onClick={() => swiper?.slideNext()}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
