import { Breadcrumbs } from '@/components/breadcrumbs';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ProfileMenu } from '@/components/profile-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useLayout } from '@/contexts/LayoutContext';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface GlobalSearchResult {
    type: string;
    label: string;
    sub?: string;
    url: string;
}

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<GlobalSearchResult[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (value: string) => {
        setQuery(value);

        if (value.length < 2) {
            setResults([]);
            return;
        }
        setLoading(true);

        try {
            const res = await axios.get(route('global.search'), {
                params: { q: value },
            });
            setResults(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    const { t } = useTranslation();
    const { position } = useLayout();

    return (
        <>
            <header className="border-sidebar-border/50 flex h-14 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-3">
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                        {position === 'left' && <SidebarTrigger className="-ml-1" />}
                        <Breadcrumbs items={breadcrumbs.map((b) => ({ label: b.title, href: b.href }))} />
                    </div>
                    {/* CENTER: Global Search */}
                    <div className="relative w-full max-w-md">
                        <input
                            type="text"
                            placeholder="Search employees, salary, training..."
                            value={query}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="focus:ring-primary w-full rounded-md border px-3 py-1.5 text-sm focus:ring-2"
                        />
                        {loading && <div className="absolute mt-1 w-full bg-white p-2 text-xs text-gray-500">Searching...</div>}
                        {results.length > 0 && (
                            <div className="absolute z-50 mt-1 max-h-80 w-full overflow-auto rounded-md border bg-white shadow">
                                {results.map((item, index) => (
                                    <a key={index} href={item.url} className="block px-3 py-2 hover:bg-gray-100">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium">{item.label}</span>
                                            <span className="text-xs text-blue-600">{item.type}</span>
                                        </div>

                                        {item.sub && <div className="text-xs text-gray-500">{item.sub}</div>}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {(usePage().props as any).isImpersonating && (
                            <button
                                onClick={() => router.post(route('impersonate.leave'))}
                                className="cursor-pointer rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
                            >
                                {t('Return Back')}
                            </button>
                        )}
                        <LanguageSwitcher />
                        <ProfileMenu />
                        {position === 'right' && <SidebarTrigger className="-mr-1" />}
                    </div>
                </div>
            </header>
        </>
    );
}
