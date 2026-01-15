// pages/list.tsx
import { CategoryItem } from '@/core/model/catalog/category-item';
interface Item {
    id?: number;
    name?: string;
    code?: string;
    desc?: string
}


function List({ items, onClick, selected }: { items?: Item[], onClick?: any, selected?: any }) {
    return (
        <div className=''>

            <ul className="divide-y  divide-gray-200 dark:divide-gray-700 border-b ">
                {items?.map(function (e, i) {
                    const isSelected = selected === e || selected === e.id;
                    return (
                        <li
                            key={i}
                            onClick={() => onClick(e)}
                            className={`cursor-pointer px-4 py-3  ${isSelected ? "bg-brand-100 dark:bg-brand-500/[0.12]" : "hover:bg-gray-50 dark:hover:bg-gray-800/60"}  transition-colors `}
                        >

                            <p className={`${"font-normal text-gray-800 dark:text-gray-100"} flex items-center justify-between`}>{e.name} <span className='text-sm text-gray-500'>{e.code}</span></p>
                            <p className='text-sm text-gray-500'>{e.desc}</p>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}



export default List;
