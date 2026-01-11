"use client";

import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useApplicationStore, useSettingsStore } from "@/store";
import { useTranslations } from "next-intl";
import { ApplicationStatus, WorkType } from "@/types";
import {
  STATUS_ORDER,
  STATUS_CONFIG,
  WORK_TYPE_CONFIG,
} from "@/config/constants";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function FilterModal() {
  const { filters, setFilters, clearFilters } = useApplicationStore();
  const { getAllSources, getAllIndustries } = useSettingsStore();
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  const sources = getAllSources();
  const industries = getAllIndustries();

  const activeFiltersCount =
    (filters.status?.length || 0) +
    (filters.source?.length || 0) +
    (filters.workType?.length || 0) +
    (filters.industry?.length || 0) +
    (filters.isPinned ? 1 : 0);

  const handleStatusChange = (status: ApplicationStatus, checked: boolean) => {
    const currentStatuses = filters.status || [];
    const newStatuses = checked
      ? [...currentStatuses, status]
      : currentStatuses.filter((s) => s !== status);
    setFilters({
      ...filters,
      status: newStatuses.length > 0 ? newStatuses : undefined,
    });
  };

  const handleSourceChange = (source: string, checked: boolean) => {
    const currentSources = filters.source || [];
    const newSources = checked
      ? [...currentSources, source]
      : currentSources.filter((s) => s !== source);
    setFilters({
      ...filters,
      source: newSources.length > 0 ? newSources : undefined,
    });
  };

  const handleWorkTypeChange = (workType: WorkType, checked: boolean) => {
    const currentWorkTypes = filters.workType || [];
    const newWorkTypes = checked
      ? [...currentWorkTypes, workType]
      : currentWorkTypes.filter((w) => w !== workType);
    setFilters({
      ...filters,
      workType: newWorkTypes.length > 0 ? newWorkTypes : undefined,
    });
  };

  const handleIndustryChange = (industry: string, checked: boolean) => {
    const currentIndustries = filters.industry || [];
    const newIndustries = checked
      ? [...currentIndustries, industry]
      : currentIndustries.filter((i) => i !== industry);
    setFilters({
      ...filters,
      industry: newIndustries.length > 0 ? newIndustries : undefined,
    });
  };

  const handlePinnedChange = (checked: boolean) => {
    setFilters({ ...filters, isPinned: checked ? true : undefined });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="group gap-1.5 relative"
          aria-label={t("common.filter")}
        >
          <Filter className="h-4 w-4" />
          <span className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap transition-all duration-200 sm:group-hover:max-w-[140px] sm:group-hover:opacity-100 sm:group-hover:ml-2">
            {t("common.filter")}
          </span>
          {activeFiltersCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-1 sm:ml-0 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("common.filter")}</DialogTitle>
          <DialogDescription>
            Filter your applications by various criteria
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 py-4">
            {/* Pinned Only */}
            <div className="flex items-center justify-between">
              <Label htmlFor="pinned-only" className="text-sm font-medium">
                {t("filter.showPinnedOnly")}
              </Label>
              <Switch
                id="pinned-only"
                checked={filters.isPinned || false}
                onCheckedChange={handlePinnedChange}
              />
            </div>

            <Separator />

            {/* Status */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                {t("filter.byStatus")}
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_ORDER.map((status) => {
                  const config = STATUS_CONFIG[status];
                  return (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status}`}
                        checked={filters.status?.includes(status) || false}
                        onCheckedChange={(checked) =>
                          handleStatusChange(status, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`status-${status}`}
                        className={cn("text-sm cursor-pointer", config.color)}
                      >
                        {t(`status.${status}`)}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Work Type */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                {t("filter.byWorkType")}
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(WORK_TYPE_CONFIG) as WorkType[]).map(
                  (workType) => {
                    const config = WORK_TYPE_CONFIG[workType];
                    return (
                      <div
                        key={workType}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`workType-${workType}`}
                          checked={
                            filters.workType?.includes(workType) || false
                          }
                          onCheckedChange={(checked) =>
                            handleWorkTypeChange(workType, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={`workType-${workType}`}
                          className="text-sm cursor-pointer"
                        >
                          {config.icon} {t(`workType.${workType}`)}
                        </Label>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            <Separator />

            {/* Source & Industry side by side */}
            <div className="grid grid-cols-2 gap-6">
              {/* Source */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  {t("filter.bySource")}
                </Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {sources.map((source) => (
                    <div key={source} className="flex items-center space-x-2">
                      <Checkbox
                        id={`source-${source}`}
                        checked={filters.source?.includes(source) || false}
                        onCheckedChange={(checked) =>
                          handleSourceChange(source, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`source-${source}`}
                        className="text-sm cursor-pointer truncate"
                      >
                        {source}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Industry */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  {t("filter.byIndustry")}
                </Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {industries.map((industry) => (
                    <div key={industry} className="flex items-center space-x-2">
                      <Checkbox
                        id={`industry-${industry}`}
                        checked={filters.industry?.includes(industry) || false}
                        onCheckedChange={(checked) =>
                          handleIndustryChange(industry, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`industry-${industry}`}
                        className="text-sm cursor-pointer truncate"
                      >
                        {industry}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex-row gap-2 sm:justify-between">
          <Button
            variant="outline"
            onClick={() => {
              clearFilters();
            }}
            className="flex-1"
          >
            <X className="mr-2 h-4 w-4" />
            {t("common.clearFilters")}
          </Button>
          <Button onClick={() => setOpen(false)} className="flex-1">
            {t("common.apply")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
