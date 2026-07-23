import { useMemo, useState } from "react";

import {
  minecraftCommandCategories,
  minecraftCommandLibrary,
} from "@/features/minecraft/data/commandLibrary";
import type {
  MinecraftCommandCategory,
  MinecraftCommandDefinition,
} from "@/features/minecraft/types/commandLibrary";

type UseCommandLibraryReturn = {
  commands: MinecraftCommandDefinition[];
  categories: typeof minecraftCommandCategories;
  searchQuery: string;
  selectedCategory: MinecraftCommandCategory;
  setSearchQuery: (value: string) => void;
  setSelectedCategory: (
    category: MinecraftCommandCategory,
  ) => void;
  resetFilters: () => void;
};

function normalizeSearchText(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase("ja-JP");
}

export function useCommandLibrary(): UseCommandLibraryReturn {
  const [searchQuery, setSearchQuery] =
    useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] =
    useState<MinecraftCommandCategory>("all");

  const commands = useMemo(() => {
    const normalizedQuery =
      normalizeSearchText(searchQuery);

    return minecraftCommandLibrary.filter(
      (command) => {
        const matchesCategory =
          selectedCategory === "all" ||
          command.category === selectedCategory;

        if (!matchesCategory) {
          return false;
        }

        if (!normalizedQuery) {
          return true;
        }

        const searchableText = [
          command.name,
          command.description,
          command.category,
          command.template,
          ...command.tags,
        ]
          .join(" ")
          .toLocaleLowerCase("ja-JP");

        return searchableText.includes(
          normalizedQuery,
        );
      },
    );
  }, [searchQuery, selectedCategory]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  return {
    commands,
    categories: minecraftCommandCategories,
    searchQuery,
    selectedCategory,
    setSearchQuery,
    setSelectedCategory,
    resetFilters,
  };
}