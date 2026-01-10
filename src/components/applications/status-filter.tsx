"use client";

import { CircleDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApplicationStore } from "@/store";
import { useTranslations } from "next-intl";
import { ApplicationStatus } from "@/types";
import { STATUS_CONFIG } from "@/config/constants";
import { cn } from "@/lib/utils";

const ALL_STATUSES: ApplicationStatus[] = [
  "applied",
  "test_case",
  "hr_interview",
  "technical_interview",
  "management_interview",
  "offer",
  "accepted",
  "rejected",
];

export function StatusFilter() {
  const { filters, setFilters } = useApplicationStore();
  const t = useTranslations();

  const selectedStatuses = filters.status || [];
  const hasSelection = selectedStatuses.length > 0;

  const toggleStatus = (status: ApplicationStatus) => {
    const current = filters.status || [];
    const updated = current.includes(status)
      ? current.filter((s) => s !== status)
      : [...current, status];

    setFilters({
      ...filters,
      status: updated.length > 0 ? updated : undefined,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <CircleDot className="h-4 w-4" />
          {t("common.status")}
          {hasSelection && (
            <span className="px-1.5 py-0 text-xs bg-secondary rounded-full">
              {selectedStatuses.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="p-3 bg-background/80 backdrop-blur-lg border shadow-lg rounded-xl"
      >
        <div className="flex flex-col gap-1.5">
          {ALL_STATUSES.map((status) => {
            const config = STATUS_CONFIG[status];
            const isChecked = selectedStatuses.includes(status);
            return (
              <button
                key={status}
                onClick={() => toggleStatus(status)}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-full transition-all cursor-pointer text-left",
                  config.bgColor,
                  config.color,
                  isChecked
                    ? "ring-2 ring-inset ring-primary/50"
                    : "hover:brightness-95"
                )}
              >
                {t(`status.${status}`)}
              </button>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
