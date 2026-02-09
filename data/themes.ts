
import { ThemeConfig } from '../types';

export const THEME_SILK_ROAD: ThemeConfig = {
    id: 'silk_road',
    fontFamily: 'font-sans', // Nunito/Default
    borderRadius: 'rounded-3xl',
    appBgOverlay: 'bg-stone-900/30',
    panelBg: 'bg-white/80 backdrop-blur-xl',
    panelBorder: 'border-white/40',
    textPrimary: 'text-stone-800',
    textSecondary: 'text-stone-500',
    textAccent: 'text-amber-600',
    buttonPrimary: 'bg-amber-400 hover:bg-amber-500 text-amber-900',
    chatUserBg: 'bg-amber-400',
    chatUserText: 'text-amber-900',
    chatAiBg: 'bg-white',
    chatAiText: 'text-stone-700',
    chatAiBorder: 'border-amber-100',
    timelineLine: 'border-white/20'
};

export const THEME_QIN: ThemeConfig = {
    id: 'qin',
    fontFamily: 'font-serif', 
    borderRadius: 'rounded-none', // Strict Legalism
    appBgOverlay: 'bg-black/60', // Darker
    panelBg: 'bg-stone-900/90 backdrop-blur-md',
    panelBorder: 'border-red-900/50',
    textPrimary: 'text-stone-100', // Light text
    textSecondary: 'text-stone-400',
    textAccent: 'text-red-500',
    buttonPrimary: 'bg-red-800 hover:bg-red-700 text-red-100 border border-red-600',
    chatUserBg: 'bg-red-900',
    chatUserText: 'text-red-100',
    chatAiBg: 'bg-stone-800',
    chatAiText: 'text-stone-300',
    chatAiBorder: 'border-stone-700',
    timelineLine: 'border-red-900/30'
};

export const THEME_QING: ThemeConfig = {
    id: 'qing',
    fontFamily: 'font-serif',
    borderRadius: 'rounded-lg',
    appBgOverlay: 'bg-emerald-950/40',
    panelBg: 'bg-[#f4f1ea]/95 backdrop-blur-sm', // Parchment color
    panelBorder: 'border-stone-300',
    textPrimary: 'text-emerald-950',
    textSecondary: 'text-emerald-800/60',
    textAccent: 'text-red-700',
    buttonPrimary: 'bg-emerald-800 hover:bg-emerald-700 text-emerald-50',
    chatUserBg: 'bg-emerald-100',
    chatUserText: 'text-emerald-900',
    chatAiBg: 'bg-white',
    chatAiText: 'text-stone-800',
    chatAiBorder: 'border-stone-200',
    timelineLine: 'border-stone-400/30'
};

export const THEME_SOVIET: ThemeConfig = {
    id: 'soviet',
    fontFamily: 'font-mono', // Industrial
    borderRadius: 'rounded-sm',
    appBgOverlay: 'bg-zinc-900/50',
    panelBg: 'bg-zinc-800/95 backdrop-blur-xl',
    panelBorder: 'border-red-600/30',
    textPrimary: 'text-zinc-100',
    textSecondary: 'text-zinc-400',
    textAccent: 'text-red-500',
    buttonPrimary: 'bg-red-700 hover:bg-red-600 text-white border-b-4 border-red-900',
    chatUserBg: 'bg-red-700',
    chatUserText: 'text-white',
    chatAiBg: 'bg-zinc-700',
    chatAiText: 'text-zinc-200',
    chatAiBorder: 'border-zinc-600',
    timelineLine: 'border-red-500/20'
};
