'use client'
import { useCallback, useEffect, useMemo, useState } from 'react';
import SearchFilters from './SearchFilter';
import MediaGrid from './MediaGrid';
import MediaDetailModal from './MediaDetailModel';
import Pagination from './pagnation';
import { searchNivl } from '../../api_service/NIVL';
import { NivlItem, SearchFilters as FilterState, NivlSearchParams } from '../../types/nivl';

const DEFAULT_PAGE_SIZE = 10;

const NIVL: React.FC = () => {
    const [filters, setFilters] = useState<FilterState>({
        query: 'earth',
        mediaType: 'all',
        center: '',
        yearStart: '',
        yearEnd: '',
        keywords: '',
        photographer: '',
        location: ''
    });

    const [items, setItems] = useState<NivlItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<NivlItem | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalHits, setTotalHits] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [searching, setSearching] = useState<boolean>(false);
    const totalPages = useMemo(() => Math.max(1, Math.ceil(totalHits / DEFAULT_PAGE_SIZE)), [totalHits]);

    const buildSearchParams = useCallback((): NivlSearchParams => {
        const params: NivlSearchParams = {
            q: filters.query || undefined,
            center: filters.center || undefined,
            description: undefined,
            description_508: undefined,
            keywords: filters.keywords || undefined,
            location: filters.location || undefined,
            media_type: filters.mediaType !== 'all' ? (filters.mediaType as 'image' | 'video' | 'audio') : undefined,
            photographer: filters.photographer || undefined,
            year_start: filters.yearStart || undefined,
            year_end: filters.yearEnd || undefined,
            page: currentPage,
            page_size: DEFAULT_PAGE_SIZE,
        };
        return params;
    }, [filters, currentPage]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = buildSearchParams();
            const { data, href } = await searchNivl(params);

            setItems(data.collection.items || []);
            setTotalHits(data.collection.metadata?.total_hits || 0);

            console.log("href from search:", href);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [buildSearchParams]);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleFiltersChange = (next: FilterState) => {
        setFilters(next);
        setCurrentPage(1);
    };

    const handleSearch = async () => {
        setSearching(true);
        setCurrentPage(1);
        await fetchData();
        setSearching(false);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="space-y-6">
            <div className="sticky top-0 md:top-2 z-30 -mx-1 px-1 pt-1 bg-gradient-to-b from-slate-900/70 to-transparent backdrop-blur supports-[backdrop-filter]:bg-opacity-80">
                <SearchFilters
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onSearch={handleSearch}
                    searching={searching}
                />
            </div>

            <MediaGrid
                items={items}
                onItemClick={setSelectedItem}
                loading={loading && !searching}
            />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalHits}
                itemsPerPage={DEFAULT_PAGE_SIZE}
                onPageChange={handlePageChange}
                loading={loading}
            />

            <MediaDetailModal
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
            />
        </div>
    );
};

export default NIVL;