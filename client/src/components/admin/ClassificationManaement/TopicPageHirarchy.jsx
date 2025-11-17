import { useLanguage } from "../../../context/LanguageContext";

export default function TopicPageHierarchy() {
    const { t } = useLanguage();
    
    return (
        <div className="w-full">
            <h2 className="text-[20px] leading-7 font-semibold text-dark-blue mb-3">{t('admin.classificationManagement.hierarchy.title')}</h2>
            <div className="border rounded-md px-5 py-4 bg-white">
                <nav className="flex flex-col gap-2">
                    <div className="flex items-center space-x-3 text-base font-medium text-blue-dark">
                        <a href="#" className="hover:underline text-dark-blue">
                            Computer Science
                        </a>
                        <span>→</span>
                        <a href="#" className="hover:underline">
                            Machine Learing
                        </a>
                    </div>
                    <div className="flex items-center space-x-3 text-base font-medium text-blue-dark">
                        <a href="#" className="hover:underline text-dark-blue">
                            Computer Science
                        </a>
                        <span>→</span>
                        <a href="#" className="hover:underline">
                            Data Visualization
                        </a>
                    </div>
                    <div className="flex items-center space-x-3 text-base font-medium text-blue-dark">
                        <a href="#" className="hover:underline text-dark-blue">
                            Computer Science
                        </a>
                        <span>→</span>
                        <a href="#" className="hover:underline">
                            Cloud Computing
                        </a>
                    </div>
                </nav>
            </div>
        </div>
    );
}
