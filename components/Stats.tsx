import React from 'react';
import { TOOLS, CATEGORIES } from '../constants';

const StatCard = ({ value, label }: { value: string; label: string }) => (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
        <div className="text-2xl font-bold">{value}</div>
        <div className="opacity-80">{label}</div>
    </div>
);

interface StatsProps {
    t: Record<string, string>;
}

export const Stats: React.FC<StatsProps> = ({ t }) => {
    const enabledToolsCount = TOOLS.filter(tool => !tool.disabled).length;
    const categoriesCount = CATEGORIES.length;

    return (
        <div className="text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                <StatCard value={enabledToolsCount.toString()} label={t.stats_tools} />
                <StatCard value={categoriesCount.toString()} label={t.stats_categories} />
                <StatCard value="99%" label={t.stats_accuracy} />
                <StatCard value="24/7" label={t.stats_availability} />
            </div>
        </div>
    );
};