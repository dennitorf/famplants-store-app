import { AlertTriangle, Clock3, ShieldCheck } from "lucide-react";
import type { PlantIssue } from "@/models/plants/plant-issue";
import CatalogImage from "@/app/components/common/catalog-image";
import { EmptyState, ErrorState } from "@/app/components/common/async-state";
import RichHtml from "@/app/components/common/rich-html";
import { plainText } from "@/lib/text";

interface PlantCommonIssuesProps {
  issues: PlantIssue[];
  error?: string;
}

export default function PlantCommonIssues({ issues, error }: PlantCommonIssuesProps) {
  if (error) return <ErrorState message={error} />;
  if (!issues.length) {
    return <EmptyState title="No common issues published" description="Plant health guidance will appear here when available." />;
  }

  const orderedIssues = [...issues].sort((left, right) => left.displayOrder - right.displayOrder);

  return (
    <div className="space-y-5">
      {orderedIssues.map((issue) => (
        <article key={issue.id} className="overflow-hidden rounded-[2rem] border border-emerald-950/10 bg-white shadow-[0_16px_50px_rgb(36_75_54_/_7%)]">
          <div className="grid md:grid-cols-[14rem_minmax(0,1fr)]">
            <div className="catalog-image !aspect-[4/3] md:!aspect-auto md:min-h-64">
              <CatalogImage
                src={issue.mainImage?.thumbnailUrl || issue.mainImage?.url}
                alt={issue.mainImage?.altText || issue.name || "Plant issue"}
                placeholderLabel="Issue photo coming soon"
              />
            </div>
            <div className="p-6 sm:p-7">
              <div className="flex flex-wrap items-center gap-2">
                {issue.category ? <span className="trait-pill text-xs font-bold text-[#4d725f]">{issue.category}</span> : null}
                {issue.severity ? <span className="trait-pill text-xs font-bold text-[#8a5a16]">{issue.severity}</span> : null}
              </div>
              <h3 className="mt-3 text-2xl font-bold text-[#153f2f]">{issue.name || "Plant issue"}</h3>
              {plainText(issue.description) ? <RichHtml content={issue.description ?? ""} className="mt-4" /> : null}
              {plainText(issue.preventionTips) ? (
                <div className="mt-5 rounded-2xl bg-[#f3faef] p-4">
                  <p className="flex items-center gap-2 font-bold text-[#24543e]"><ShieldCheck className="h-4 w-4" /> Prevention</p>
                  <RichHtml content={issue.preventionTips ?? ""} className="mt-2" />
                </div>
              ) : null}
              <div className="mt-5 flex flex-wrap gap-3 text-xs font-bold text-[#637b70]">
                {issue.typicalRecoveryDays ? <span className="inline-flex items-center gap-1.5"><Clock3 className="h-4 w-4" /> About {issue.typicalRecoveryDays} recovery days</span> : null}
                {issue.canKillPlant ? <span className="inline-flex items-center gap-1.5 text-[#9b3e32]"><AlertTriangle className="h-4 w-4" /> Can seriously harm the plant</span> : null}
                {issue.isContagious ? <span className="inline-flex items-center gap-1.5 text-[#9b3e32]"><AlertTriangle className="h-4 w-4" /> Can spread</span> : null}
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
