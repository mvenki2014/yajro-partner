import * as React from "react";
import { useSetShell } from "@/context/ShellContext";
import { BottomNav } from "@/components/layout/BottomNav";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { earningsSummary } from "@/data/partner-mock";

export function PartnerEarnings({ onNavigate }: { onNavigate: (tab: any) => void }) {
  const [withdrawAmount, setWithdrawAmount] = React.useState("");

  useSetShell({
    title: <PageHeader title="Earnings" onBack={() => onNavigate("dashboard")} />,
    bottomNav: <BottomNav activeTab="earnings" onTabChange={onNavigate} />,
  });

  return (
    <div className="space-y-4 pb-20">
      <div className="grid grid-cols-2 gap-3">
        <SummaryCard label="Total Earnings" value={`INR ${earningsSummary.total}`} />
        <SummaryCard label="Weekly Earnings" value={`INR ${earningsSummary.weekly}`} />
        <SummaryCard label="Monthly Earnings" value={`INR ${earningsSummary.monthly}`} />
        <SummaryCard label="Wallet Balance" value={`INR ${earningsSummary.walletBalance}`} />
      </div>

      <Card className="p-4">
        <h2 className="text-sm font-bold text-slate-900">Commission Breakdown</h2>
        <div className="mt-2 rounded-xl bg-slate-50 p-3">
          <p className="text-sm text-slate-700">Platform commission deducted this month</p>
          <p className="mt-1 text-lg font-bold text-[#B35300]">INR {earningsSummary.commission}</p>
        </div>
      </Card>

      <Card className="p-4">
        <h2 className="text-sm font-bold text-slate-900">Withdraw Request</h2>
        <div className="mt-3 space-y-2">
          <Input
            type="number"
            placeholder="Enter amount"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
          />
          <Button className="w-full" disabled={!withdrawAmount || Number(withdrawAmount) <= 0}>
            Request Withdrawal
          </Button>
          <p className="text-xs text-slate-500">Optional payout integration: Razorpay Payout API.</p>
        </div>
      </Card>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-3">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-900">{value}</p>
    </Card>
  );
}
