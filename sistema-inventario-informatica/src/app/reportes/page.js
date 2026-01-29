import OfficeReportTable from '@/components/OfficeReportTable';
import MainLayout from '@/components/MainLayout';

export default function ReportesPage() {
    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto">
                <OfficeReportTable />
            </div>
        </MainLayout>
    );
}
