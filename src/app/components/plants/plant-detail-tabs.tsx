"use client";

import { useState, type ReactNode } from "react";
import { BookOpen, ShieldAlert } from "lucide-react";

interface PlantDetailTabsProps {
  careInformation: ReactNode;
  commonIssues: ReactNode;
  issueCount: number;
}

type PlantDetailTab = "care" | "issues";

export default function PlantDetailTabs({
  careInformation,
  commonIssues,
  issueCount,
}: PlantDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<PlantDetailTab>("care");

  return (
    <section className="pb-16">
      <div
        role="tablist"
        aria-label="Plant guidance"
        className="flex gap-2 border-b border-emerald-950/10"
      >
        <TabButton
          active={activeTab === "care"}
          controls="care-information-panel"
          icon={<BookOpen className="h-4 w-4" />}
          label="Care Information"
          onClick={() => setActiveTab("care")}
        />
        <TabButton
          active={activeTab === "issues"}
          controls="common-issues-panel"
          icon={<ShieldAlert className="h-4 w-4" />}
          label={`Common Issues${issueCount ? ` (${issueCount})` : ""}`}
          onClick={() => setActiveTab("issues")}
        />
      </div>

      <div
        id="care-information-panel"
        role="tabpanel"
        aria-labelledby="care-information-tab"
        hidden={activeTab !== "care"}
        className="pt-8"
      >
        {careInformation}
      </div>
      <div
        id="common-issues-panel"
        role="tabpanel"
        aria-labelledby="common-issues-tab"
        hidden={activeTab !== "issues"}
        className="pt-8"
      >
        {commonIssues}
      </div>
    </section>
  );
}

interface TabButtonProps {
  active: boolean;
  controls: string;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

function TabButton({ active, controls, icon, label, onClick }: TabButtonProps) {
  const id = controls === "care-information-panel"
    ? "care-information-tab"
    : "common-issues-tab";

  return (
    <button
      id={id}
      type="button"
      role="tab"
      aria-selected={active}
      aria-controls={controls}
      onClick={onClick}
      className={`relative inline-flex items-center gap-2 px-4 py-3 text-sm font-extrabold transition-colors ${
        active ? "text-[#0A3D27]" : "text-[#71877c] hover:text-[#315b48]"
      }`}
    >
      {icon}
      {label}
      {active ? <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#198754]" /> : null}
    </button>
  );
}
