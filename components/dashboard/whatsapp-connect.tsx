"use client";

import { MessagesSquare, PenLine, Heart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContainer, CardHeader, CardFooter, FeatureGrid } from "./cards";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";

const features = [
  {
    icon: <PenLine className="w-4 h-4 text-purple-300/90" />,
    title: "Dream Recorder",
    description: "Save your dreams, through voice or text, as soon as you wake up"
  },
  {
    icon: <MessagesSquare className="w-4 h-4 text-purple-300/90" />,
    title: "Always Connected",
    description: "Accessible anytime, anywhere, whenever you need"
  },
  {
    icon: <Zap className="w-4 h-4 text-purple-300/90" />,
    title: "Instant Insights",
    description: "Reveal the hidden meanings of your dreams instantly"
  },
  {
    icon: <Heart className="w-4 h-4 text-purple-300/90" />,
    title: "Meaningful Chats",
    description: "A companion that remembers your story and knows you"
  }
];

export function WhatsAppConnect() {
  return (
    <div className="h-full">
      <CardContainer>
        <CardHeader
          icon={<WhatsAppIcon className="w-5 h-5 text-purple-300" />}
          title="Never Miss a Dream"
          description="Your companion in self-discovery, one message away"
        />

        <FeatureGrid features={features} />

        <CardFooter
          disclaimer={["Easy setup", "Private & secure", "Your journey at your pace"]}
        >
          <Button
            className="w-full bg-gradient-to-r from-purple-500/80 to-indigo-500/80 
              hover:from-purple-500/90 hover:to-indigo-500/90
              text-white font-medium px-6 py-2
              rounded-full shadow-lg shadow-purple-500/20
              hover:shadow-purple-500/30
              transition-all duration-300 border border-white/10
              hover:border-white/20 flex items-center justify-center gap-2"
            size="lg"
          >
            <WhatsAppIcon className="w-4 h-4" />
            Connect your WhatsApp
          </Button>
        </CardFooter>
      </CardContainer>
    </div>
  );
}