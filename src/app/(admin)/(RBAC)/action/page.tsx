import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import React from 'react'

function ActionPage() {
    return (
        <div>
            <PageBreadcrumb subTitle={["Subaction1"]} pagePath='/action' pageTitle="Action" />
            ActionPage</div>
    )
}

export default ActionPage