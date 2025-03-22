"use client";
import { Button } from "@/components/ui/button";
import React, { useContext, useEffect } from "react";
import AIAssistantList from "@/services/AIAssistantList";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { ShineBorder } from "@/components/magicui/shine-border";
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AuthContext } from "@/context/AuthContext";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

export type ASSISTANT = {
  id: number;
  name: string;
  title: string;
  image: string;
  instruction: string;
  userInstruction: string;
  sampleQuestions: string[];
};

function AIAssistants() {
  const [selectedAssistant, setSelectedAssistant] = useState<ASSISTANT[]>([]);
  const writeAssistants = useMutation(api.assistants.addSelectedAssistants);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  // // Get user assistants
  // const convex = useConvex();
  // const router = useRouter();

  // useEffect(() => {
  //   const getUserAssistants = async () => {
  //     const output = await convex.query(api.assistants.getAllUserAssistants, {
  //       uid: user?._id,
  //     });
  //     console.log(output);

  //     if (output.length > 0) {
  //       // Navigate to new screen
  //       router.replace("/workspace");
  //       return;
  //     }
  //   };

  //   if (user) {
  //     getUserAssistants();
  //   }
  // }, [user, convex, router]);

  const onSelect = (assistant: ASSISTANT) => {
    const item = selectedAssistant.find(
      (item: ASSISTANT) => item.id == assistant.id
    );

    if (item) {
      setSelectedAssistant(
        selectedAssistant.filter((item) => item.id !== assistant.id)
      );
      return;
    }
    setSelectedAssistant((prev) => [...prev, assistant]);
  };

  const isAssistantSelected = (assistant: ASSISTANT) => {
    const item = selectedAssistant.find(
      (item: ASSISTANT) => item.id == assistant.id
    );
    return item ? true : false;
  };

  const continueButtonHandler = async () => {
    setLoading(true);
    const output = await writeAssistants({
      records: selectedAssistant,
      uid: user?._id,
    });
    setLoading(false);
    console.log(output);
  };

  return (
    <div className="px-10 mt-20 md:px-28 lg:px-36 xl:px-48">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-orange-300">
            Welcome to the AIssistant 🤖
          </h2>
          <p className="text-xl mt-2">
            Choose Your AI Champion to Simplify Your Task
          </p>
        </div>

        <div>
          <Button
            className="bg-orange-300 text-black font-bold"
            disabled={selectedAssistant?.length === 0 || loading}
            onClick={continueButtonHandler}
          >
            {loading && <Loader2Icon className="animate-spin" />} Continue
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-10">
        {AIAssistantList.map((item, idx) => (
          <div
            key={idx}
            className="hover:border border-orange-300 rounded-4xl p-3 hover:scale-105 transition-all ease-in-out cursor-pointer relative"
            onClick={() => onSelect(item)}
          >
            <ShineBorder borderWidth={1} shineColor={["#FFA500", "#FFD700"]} />
            <Checkbox
              className="absolute m-3"
              checked={isAssistantSelected(item)}
            />
            <Image
              src={item.image}
              alt={item.title}
              width={600}
              height={600}
              className="rounded-4xl w-full h-[200px] object-cover"
            />
            <h2 className="text-center font-bold text-lg">{item.name}</h2>
            <h2 className="text-center text-gray-600">{item.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AIAssistants;
