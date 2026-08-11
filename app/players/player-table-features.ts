import {
    columnFilteringFeature,
    columnVisibilityFeature,
    createFilteredRowModel,
    createSortedRowModel,
    filterFn_arrHas,
    filterFn_includesString,
    filterFn_inNumberRange,
    rowPaginationFeature,
    rowSelectionFeature,
    rowSortingFeature,
    sortFn_alphanumeric,
    sortFn_text,
    tableFeatures 

} from "@tanstack/react-table"


export const features = tableFeatures({
    columnFilteringFeature,
    columnVisibilityFeature,
    filteredRowModel: createFilteredRowModel(),
    filterFns: {
        arrHas: filterFn_arrHas,
        includeString: filterFn_includesString,
        inNumberRange: filterFn_inNumberRange,
    },
    rowPaginationFeature,
    rowSelectionFeature,
    rowSortingFeature,
    sortedRowModel: createSortedRowModel(),
    sortFns: {
        alphanumeric: sortFn_alphanumeric,
        text: sortFn_text,
    },
});

export type DataTableFeatures = typeof features;