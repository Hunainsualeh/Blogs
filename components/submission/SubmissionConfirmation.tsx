"use client";

import type { SubmissionReceipt } from "@/types/submission";
import { STATUS_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CheckIcon, InfoIcon, PenIcon } from "@/components/ui/Icons";
import { StatusTimeline } from "./StatusTimeline";

type SubmissionConfirmationProps = {
  receipt: SubmissionReceipt;
  onEdit: () => void;
  onStartNew: () => void;
};

export function SubmissionConfirmation({ receipt, onEdit, onStartNew }: SubmissionConfirmationProps) {
  return (
    <div className="mx-auto max-w-3xl py-10 sm:py-16 reveal">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E7F5EE] text-success">
        <CheckIcon size={28} />
      </span>
      <h1 className="mt-6 text-[34px] font-semibold leading-tight tracking-[-0.04em] text-ink sm:text-[44px]">Your article has been submitted for review.</h1>
      <p className="mt-4 text-[17px] leading-relaxed text-ink-muted">Our editorial team will review your article before publication. We will email you with a decision or suggested edits, usually within 5 to 7 working days.</p>

      <dl className="mt-10 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-3">
        <div className="bg-white p-5">
          <dt className="kicker text-ink-subtle">Submission ID</dt>
          <dd className="mt-2 font-mono text-[17px] font-medium text-ink">{receipt.id}</dd>
        </div>
        <div className="bg-white p-5 sm:col-span-2">
          <dt className="kicker text-ink-subtle">Article title</dt>
          <dd className="mt-2 text-[17px] font-semibold leading-snug text-ink">{receipt.title}</dd>
        </div>
        <div className="bg-white p-5">
          <dt className="kicker text-ink-subtle">Current status</dt>
          <dd className="mt-2"><Badge tone="brand">{STATUS_LABELS[receipt.status]}</Badge></dd>
        </div>
        <div className="bg-white p-5 sm:col-span-2">
          <dt className="kicker text-ink-subtle">Submitted</dt>
          <dd className="mt-2 text-[15px] text-ink">{formatDate(receipt.createdAt, "long")}</dd>
        </div>
      </dl>

      <div className="mt-10">
        <p className="kicker mb-4 text-ink-subtle">Review progress</p>
        <StatusTimeline status={receipt.status} />
      </div>

      <p className="mt-10 flex gap-3 rounded-md bg-surface-muted p-4 text-[13.5px] leading-relaxed text-ink-muted">
        <InfoIcon size={18} className="mt-0.5 shrink-0 text-brand" />
        This build has no database connected yet. Your submission was validated and stored in server memory only, so it will be cleared when the server restarts. A copy of your draft stays saved in this browser.
      </p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button onClick={onEdit} variant="outline" icon={<PenIcon size={16} />} iconPosition="start">Edit draft</Button>
        <Button onClick={onStartNew} variant="ghost">Start a new article</Button>
        <Button href="/" className="sm:ml-auto">Return home</Button>
      </div>
    </div>
  );
}
