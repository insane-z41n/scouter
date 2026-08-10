import { 
    columnFilteringFeature,
    columnVisibilityFeature,
    createFilteredRowModel,
    createSortedRowModel,
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