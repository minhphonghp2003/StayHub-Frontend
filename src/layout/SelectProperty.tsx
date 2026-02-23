"use client"

import { setSelectedPropertyId } from "@/redux/features/property/PropertySlice"
import { RootState } from "@/redux/store"
import { useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

function SelectProperty() {

    const currentProperty = useSelector((state: RootState) => state.property.selectedPropertyId)
    const propertyList = useSelector((state: RootState) => state.property.value)
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement | null>(null)

    const selected = propertyList?.find(p => p.id === currentProperty) ?? null

    const onSelect = (id: number | undefined | null) => {
        dispatch(setSelectedPropertyId(id ?? null))
        setOpen(false)
    }
    return (
        <div className="hidden lg:block">
            <div ref={containerRef} tabIndex={0} onBlur={() => setOpen(false)}>
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setOpen(v => !v)}
                        aria-expanded={open}
                        className="dark:bg-dark-900  w-full rounded-lg border border-gray-200 bg-transparent py-1 pl-3 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px] text-left"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                                {selected?.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={selected.image} alt={selected?.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">No</div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{selected?.name ?? 'Select property'}</span>
                                    {selected?.type?.name && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400">• {selected.type.name}</span>
                                    )}
                                </div>
                                {selected?.address && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{selected.address}</div>
                                )}
                            </div>
                            {selected?.tier?.name && (
                                <span className="menu-dropdown-badge menu-dropdown-badge-inactive ml-2 whitespace-nowrap">{selected.tier.name}</span>
                            )}
                        </div>
                    </button>

                    {open && (
                        <div className="absolute z-50 mt-2 w-full rounded bg-white shadow-lg dark:bg-gray-900">
                            <ul className="max-h-80 overflow-auto">
                                {propertyList && propertyList.length > 0 ? (
                                    propertyList.map((p) => (
                                        <li
                                            key={p.id}
                                            className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                                            onMouseDown={(e) => { e.preventDefault(); onSelect(p.id) }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                                                    {p.image ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">No</div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{p.name}</span>
                                                        {p.type?.name && (
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">• {p.type?.name}</span>
                                                        )}
                                                        {p.tier?.name && (
                                                            <span className="ml-auto menu-dropdown-badge menu-dropdown-badge-inactive">{p.tier.name}</span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{p.address}</div>
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li className="px-4 py-2 text-sm text-gray-500">No properties available</li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SelectProperty