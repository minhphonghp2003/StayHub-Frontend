import DynamicIcon from '@/components/common/DynamicIcon';
import Input from '@/components/form/InputField';
import { FormSelect } from '@/components/form/Select';
import TextArea from '@/components/form/TextArea';
import ActionModal from '@/components/ui/modal/ActionModal';
import { Spinner } from '@/components/ui/shadcn/spinner';
import { CategoryItem } from '@/core/model/catalog/category-item';
import { Menu } from '@/core/model/RBAC/Menu';
import { UpdateMenuPayload } from '@/core/payload/RBAC/udpate-menu-payload';
import { categoryItemService } from '@/core/service/catalog/category-item-service';
import menuService from '@/core/service/RBAC/menu-service';
import { showToast, toastPromise } from '@/lib/alert-helper';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from "react-hook-form";

type FormValues = {
    name: string;
    path: string;
    icon?: string;
    groupId?: string;
    parentId?: string;
    description?: string;
    order?: number;
};
function UpdateMenuModal({ isOpen, closeModal, menu, reload }: { isOpen: boolean, closeModal: any, menu?: Menu | null, reload: any }) {
    let [menuGroups, setMenuGroup] = useState<CategoryItem[]>([])
    let [parentMenus, setParentMenus] = useState<CategoryItem[]>([])
    let [icon, setIcon] = useState<string>("")
    let [isLoading, setIsLoading] = useState(true)
    const form = useForm<FormValues>();

    const handleSubmitForm: SubmitHandler<FormValues> = async (data,) => {
        const payload: UpdateMenuPayload = {
            name: data.name,
            path: data.path,
            icon: data.icon || undefined,
            groupId: data.groupId ? Number(data.groupId) : 0,
            parentId: data.parentId ? Number(data.parentId) : undefined,
            description: data.description || undefined,
            order: data.order,
        };
        try {
            const result = await toastPromise(
                menuService.updateMenu(menu?.id ?? 0, payload),
                {
                    loading: "Cập nhật menu...",
                    success: "Cập nhật menu thành công!",
                    error: "Cập nhật menu thất bại!",
                }
            );
            if (result) {
                closeModal();
                reload();
                form.reset()
            }
        } catch (err) {
            showToast({ type: "error", content: "Có lỗi xảy ra" })
        }

    };
    useEffect(() => {
        if (!isOpen) return;
        setIsLoading(true);

        Promise.all([
            menuService.getMenuById(menu?.id ?? 0),
            menuService.getAllNoPaginateMenus(),
            categoryItemService.getCategoryItemsByCategoryCode("MENU")
        ]).then(([menuDetailResponse, parentMenusResponse, menuGroupResponse]) => {

            setParentMenus(parentMenusResponse);
            setMenuGroup(menuGroupResponse)
            setIcon(menuDetailResponse?.icon ?? "");
            form.reset({
                name: menuDetailResponse?.name ?? "",
                path: menuDetailResponse?.path ?? "",
                icon: menuDetailResponse?.icon ?? "",
                description: menuDetailResponse?.description ?? "",
                groupId: menuDetailResponse?.groupId
                    ? menuDetailResponse.groupId.toString()
                    : undefined,
                parentId: menuDetailResponse?.parentId
                    ? menuDetailResponse.parentId.toString()
                    : undefined,

                order: menuDetailResponse?.order,
            });
            setIsLoading(false);
        });

        return () => {
            setIcon("");
            form.reset({
                name: "",
                path: "",
                icon: "",
                groupId: undefined,
                parentId: undefined,
                description: "",
                order: undefined,
            })
        };
    }, [isOpen])

    return (
        <ActionModal size="md" isOpen={isOpen} closeModal={closeModal} onConfirm={form.handleSubmit(handleSubmitForm)} heading={"Cập nhật menu"} >
            <div className="relative">

                {isLoading && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-md transition-all duration-200">
                        <div className="flex flex-col items-center gap-2">
                            <Spinner className="size-14 text-brand-300" />
                            <span className="text-sm text-muted-foreground">Đang tải dữ liệu...</span>
                        </div>
                    </div>
                )}

                <div className={`flex flex-col gap-4 ${isLoading ? "pointer-events-none opacity-50" : ""}`}>
                    <div className="flex gap-2 justify-between items-center">
                        <Input {...form.register("name")} required label="Tên" type="text" />
                        <Input {...form.register("path")} required label="Đường dẫn" type="text" />
                    </div>

                    <Input
                        {...form.register("icon")}
                        onChange={(e) => setIcon(e.target.value)}
                        suffix={<DynamicIcon iconString={icon} className="text-gray-500" />}
                        label="Icon"
                        type="text"
                    />

                    <div className="flex gap-2">
                        {

                            menuGroups.length > 0 && <FormSelect
                                name="groupId"
                                control={form.control}
                                label="Nhóm menu"
                                required
                                options={menuGroups.map(g => ({
                                    value: g.id?.toString(),
                                    label: g.name,
                                }))}
                            />
                        }
                        {
                            parentMenus.length > 0 &&
                            <FormSelect
                                name="parentId"
                                control={form.control}
                                label="Thuộc Menu"
                                options={parentMenus.map(g => ({
                                    value: g.id?.toString(),
                                    label: g.name,
                                }))}
                            />
                        }
                    </div>
                    <Input {...form.register("order")} type="number" label="Thứ tự" min={1} />
                    <TextArea {...form.register("description")} label="Mô tả" />
                </div>
            </div>
        </ActionModal>
    )
}

export default UpdateMenuModal

