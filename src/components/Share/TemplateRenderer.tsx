import React from "react";

import Template1 from "./Templates/Template1";
import Template2 from "./Templates/Template2";
import Template3 from "./Templates/Template3";
import Template4 from "./Templates/Template4";

export interface TemplateRendererProps {
  template: number;

  arabic: string;
  urdu?: string;
  english?: string;

  surahName: string;
  surahNumber: number;
  ayahNumber: number;

  arabicFontSize: number;
  urduFontSize: number;
  englishFontSize: number;

  websiteUrl?: string;
  brandName?: string;

  showQr?: boolean;
  showBismillah?: boolean;

  showUrdu?: boolean;
  showEnglish?: boolean;
}

const TemplateRenderer: React.FC<TemplateRendererProps> = (props) => {

  switch (props.template) {

    case 1:
      return <Template1 {...props} />;

    case 2:
      return <Template2 {...props} />;

    case 3:
      return <Template3 {...props} />;

    case 4:
      return <Template4 {...props} />;

    default:
      return <Template1 {...props} />;
  }
};

export default TemplateRenderer;