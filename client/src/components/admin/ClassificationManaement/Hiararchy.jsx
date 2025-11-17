import { useLanguage } from "../../../context/LanguageContext";

export default function HierarchyBreadcrumb() {
  const { t } = useLanguage();
  
  return (
    <div className="w-full">
      <h2 className="text-[20px] leading-7 font-semibold text-dark-blue mb-3">{t('admin.classificationManagement.hierarchy.title')}</h2>
      <div className="border rounded-md px-5 py-4 bg-white">
        <nav className="flex items-center space-x-3 text-base font-medium text-blue-dark">
          <a href="#" className="hover:underline text-dark-blue">
            {t('admin.classificationManagement.hierarchy.subject')}
          </a>
          <span>→</span>
          <a href="#" className="hover:underline">
            {t('admin.classificationManagement.hierarchy.topic')}
          </a>
          <span>→</span>
          <a href="#" className="hover:underline">
            {t('admin.classificationManagement.hierarchy.subtopic')}
          </a>
          <span>→</span>
          <a href="#" className="hover:underline">
            {t('admin.classificationManagement.hierarchy.concept')}
          </a>
        </nav>
      </div>
    </div>
  );
}
