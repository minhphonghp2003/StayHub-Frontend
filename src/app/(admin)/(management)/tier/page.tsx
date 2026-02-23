"use client";
import AddTierModal from "@/app/(admin)/(management)/tier/add-tier-modal";
import DeleteTierModal from "@/app/(admin)/(management)/tier/delete-tier-modal";
import UpdateTierModal from "@/app/(admin)/(management)/tier/update-tier-modal";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Button } from "@/components/ui/shadcn/button";
import { Spinner } from "@/components/ui/shadcn/spinner";
import { Tier } from "@/core/model/tier/tier";
import { tierService } from "@/core/service/tier/tier-service";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

type ModalState = {
  type: "ADD" | "UPDATE" | "DELETE" | null;
  data: Tier | null;
};

function TierPage() {
  const [modal, setModalState] = useState<ModalState>({ type: null, data: null });
  const [loading, setLoading] = useState(true);
  const [tiers, setTiers] = useState<Tier[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setTiers([]);
    const result = await tierService.getAllTiers({
      pageNumber: 1,
      pageSize: 100,
    });
    setTiers(result?.data ?? []);
    setLoading(false);
  };

  const closeModal = () => {
    setModalState({ type: null, data: null });
  };

  const parseDescription = (description?: string): string[] => {
    if (!description) return [];
    return description
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  };

  const formatPrice = (price?: number): string => {
    if (!price) return "0";
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <PageBreadcrumb pagePath="/tier" pageTitle="Tier" />

      <div className=" mx-auto ">
        {/* Header Section */}
        <div className="flex  justify-end mb-2">
          <Button
            onClick={() => setModalState({ type: "ADD", data: null })}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Thêm mới
          </Button>
        </div>


        {/* Empty State */}
        {tiers.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Chưa có gói dịch vụ nào
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Bắt đầu bằng cách tạo gói dịch vụ đầu tiên của bạn
            </p>
            <Button onClick={() => setModalState({ type: "ADD", data: null })}>
              Tạo Gói Đầu Tiên
            </Button>
          </div>
        ) : (
          <>
            {/* Pricing Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tiers.map((tier) => {
                const features = parseDescription(tier.description);
                return (
                  <div
                    key={tier.id}
                    className="group relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative p-8">
                      {/* Tier Header */}
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {tier.name || "Unnamed Tier"}
                        </h3>
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-4">
                          {tier.code}
                        </p>

                        {/* Price */}
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold text-gray-900 dark:text-white">
                            {formatPrice(tier.price)}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            VNĐ/{tier.billingCycle || "month"}
                          </span>
                        </div>
                      </div>

                      {/* Features List */}
                      {features.length > 0 && (
                        <div className="mb-8 py-8 border-t border-b border-gray-200 dark:border-gray-700">
                          <ul className="space-y-3">
                            {features.map((feature, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                              >
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5">
                                  <span className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full" />
                                </span>
                                <span className="text-sm">
                                  {feature}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setModalState({
                              type: "UPDATE",
                              data: tier,
                            })
                          }
                          className="flex-1 gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                          Chỉnh sửa
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            setModalState({
                              type: "DELETE",
                              data: tier,
                            })
                          }
                          className="flex-1 gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Xoá
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <AddTierModal
        isOpen={modal.type === "ADD"}
        closeModal={closeModal}
        reload={fetchData}
      />
      <UpdateTierModal
        isOpen={modal.type === "UPDATE" && modal.data !== null}
        closeModal={closeModal}
        tier={modal.data}
        reload={fetchData}
      />
      <DeleteTierModal
        isOpen={modal.type === "DELETE" && modal.data !== null}
        closeModal={closeModal}
        tier={modal.data}
        reload={fetchData}
      />
    </div>
  );
}

export default TierPage;