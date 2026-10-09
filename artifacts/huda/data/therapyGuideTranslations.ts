import type { TherapyLesson } from './therapyLessons';
import type { LanguageCode } from './translations';

export type TherapyLessonId = 'speech-aac' | 'occupational' | 'play' | 'caregiver' | 'behavior';
export type TherapyReferenceId = 'cdc' | 'asha' | 'nice' | 'who' | 'aap';

export interface TherapyGuideCopy {
  title: string;
  videoLabel: string;
  notice: string;
  possibleBenefits: string;
  limitations: string;
  professionalGuidance: string;
  fullTranscript: string;
  references: string;
  moreLessons: string;
  videoError: string;
  retry: string;
  retryVideo: string;
  couldNotOpenLink: string;
  openWebsite: string;
  internetRequired: string;
  backToLessonLibrary: string;
  backToCaregiverDashboard: string;
  openLesson: string;
  durationTemplate: string;
}

interface LocalizedLesson {
  title: string;
  category: string;
  summary: string;
  benefits: [string, string, string];
  limitations: string;
  professional: string;
}

const guideCopy: Record<LanguageCode, TherapyGuideCopy> = {
  en: {
    title: 'Therapy Guide',
    videoLabel: 'Video:',
    notice: 'Original Huda animations include offline synthetic narration and subtitles in the selected app language. They are educational, not clinician demonstrations. General education only—not diagnosis or treatment instructions. Cited sources do not endorse this app. Lessons, narration, subtitles, and reference summaries are stored offline; source websites need internet.',
    possibleBenefits: 'Possible benefits',
    limitations: 'Limitations',
    professionalGuidance: 'Professional guidance',
    fullTranscript: 'Full transcript',
    references: 'References',
    moreLessons: 'More lessons',
    videoError: 'This video could not be played.',
    retry: 'Retry',
    retryVideo: 'Retry video',
    couldNotOpenLink: 'Could not open the link. Check your internet connection and try again.',
    openWebsite: 'Open source website',
    internetRequired: 'Requires internet',
    backToLessonLibrary: 'Back to lesson library',
    backToCaregiverDashboard: 'Back to caregiver dashboard',
    openLesson: 'Open lesson',
    durationTemplate: '{seconds}-second animation · {subtitles}: {language}',
  },
  es: {
    title: 'Guía de terapias',
    videoLabel: 'Vídeo:',
    notice: 'Las animaciones originales de Huda incluyen narración sintética y subtítulos sin conexión en el idioma elegido en la app. Son educativas, no demostraciones clínicas. Información general; no es un diagnóstico ni instrucciones de tratamiento. Las fuentes citadas no respaldan esta app. Las lecciones, la narración, los subtítulos y los resúmenes están disponibles sin conexión; los sitios web de las fuentes requieren internet.',
    possibleBenefits: 'Posibles beneficios',
    limitations: 'Limitaciones',
    professionalGuidance: 'Orientación profesional',
    fullTranscript: 'Transcripción completa',
    references: 'Referencias',
    moreLessons: 'Más lecciones',
    videoError: 'No se pudo reproducir este video.',
    retry: 'Reintentar',
    retryVideo: 'Reintentar el video',
    couldNotOpenLink: 'No se pudo abrir el enlace. Comprueba tu conexión a internet e inténtalo de nuevo.',
    openWebsite: 'Abrir sitio web de la fuente',
    internetRequired: 'Requiere internet',
    backToLessonLibrary: 'Volver a la lista de lecciones',
    backToCaregiverDashboard: 'Volver al panel de cuidadores',
    openLesson: 'Abrir lección',
    durationTemplate: 'Animación de {seconds} s · {subtitles}: {language}',
  },
  fr: {
    title: 'Guide des thérapies',
    videoLabel: 'Vidéo :',
    notice: 'Les animations originales de Huda incluent une narration synthétique et des sous-titres hors ligne dans la langue choisie dans l’app. Elles sont éducatives, pas des démonstrations cliniques. Informations générales uniquement, sans diagnostic ni consignes de traitement. Les sources citées ne soutiennent pas l’app. Les leçons, la narration, les sous-titres et les résumés des références sont disponibles hors ligne ; les sites sources nécessitent Internet.',
    possibleBenefits: 'Bénéfices possibles',
    limitations: 'Limites',
    professionalGuidance: 'Conseils de professionnels',
    fullTranscript: 'Transcription complète',
    references: 'Références',
    moreLessons: 'Autres leçons',
    videoError: 'Impossible de lire cette vidéo.',
    retry: 'Réessayer',
    retryVideo: 'Réessayer la vidéo',
    couldNotOpenLink: 'Impossible d’ouvrir le lien. Vérifiez votre connexion Internet et réessayez.',
    openWebsite: 'Ouvrir le site de la source',
    internetRequired: 'Internet requis',
    backToLessonLibrary: 'Retour à la liste des leçons',
    backToCaregiverDashboard: 'Retour au tableau de bord des aidants',
    openLesson: 'Ouvrir la leçon',
    durationTemplate: 'Animation de {seconds} s · {subtitles} : {language}',
  },
  ar: {
    title: 'دليل العلاجات',
    videoLabel: 'فيديو:',
    notice: 'تتضمن رسوم هدى الأصلية سردًا اصطناعيًا وترجمة نصية تعمل دون اتصال بلغة التطبيق المحددة. وهي مواد تعليمية وليست عروضًا سريرية. معلومات عامة فقط، وليست تشخيصًا أو تعليمات علاجية. المصادر المذكورة لا تؤيد التطبيق. الدروس والسرد والترجمة النصية وملخصات المراجع متاحة دون اتصال؛ وتتطلب مواقع المصادر اتصالًا بالإنترنت.',
    possibleBenefits: 'فوائد محتملة',
    limitations: 'القيود',
    professionalGuidance: 'إرشاد المختصين',
    fullTranscript: 'النص الكامل',
    references: 'المراجع',
    moreLessons: 'دروس أخرى',
    videoError: 'تعذر تشغيل هذا الفيديو.',
    retry: 'إعادة المحاولة',
    retryVideo: 'إعادة تشغيل الفيديو',
    couldNotOpenLink: 'تعذر فتح الرابط. تحقق من اتصالك بالإنترنت ثم حاول مرة أخرى.',
    openWebsite: 'فتح موقع المصدر',
    internetRequired: 'يتطلب اتصالًا بالإنترنت',
    backToLessonLibrary: 'العودة إلى قائمة الدروس',
    backToCaregiverDashboard: 'العودة إلى لوحة مقدم الرعاية',
    openLesson: 'فتح الدرس',
    durationTemplate: 'رسوم متحركة مدتها {seconds} ثانية · {subtitles}: {language}',
  },
  de: {
    title: 'Therapieratgeber',
    videoLabel: 'Video:',
    notice: 'Die Originalanimationen von Huda enthalten synthetische Erzählung und Untertitel in der ausgewählten App-Sprache und sind offline verfügbar. Es sind Lernanimationen, keine klinischen Vorführungen. Nur allgemeine Informationen – keine Diagnose und keine Behandlungsanweisungen. Die genannten Quellen unterstützen diese App nicht. Lektionen, Erzählung, Untertitel und Referenzzusammenfassungen sind offline verfügbar; die Quellwebsites benötigen Internet.',
    possibleBenefits: 'Mögliche Vorteile',
    limitations: 'Einschränkungen',
    professionalGuidance: 'Fachliche Begleitung',
    fullTranscript: 'Vollständiges Transkript',
    references: 'Quellen',
    moreLessons: 'Weitere Lektionen',
    videoError: 'Dieses Video konnte nicht abgespielt werden.',
    retry: 'Erneut versuchen',
    retryVideo: 'Video erneut versuchen',
    couldNotOpenLink: 'Der Link konnte nicht geöffnet werden. Prüfe deine Internetverbindung und versuche es erneut.',
    openWebsite: 'Website der Quelle öffnen',
    internetRequired: 'Internet erforderlich',
    backToLessonLibrary: 'Zurück zur Lektionsübersicht',
    backToCaregiverDashboard: 'Zurück zur Übersicht für Betreuungspersonen',
    openLesson: 'Lektion öffnen',
    durationTemplate: '{seconds}-Sekunden-Animation · {subtitles}: {language}',
  },
  pt: {
    title: 'Guia de terapias',
    videoLabel: 'Vídeo:',
    notice: 'As animações originais da Huda incluem narração sintética e legendas offline no idioma selecionado no app. São educativas, não demonstrações clínicas. Informações gerais; não são diagnóstico nem instruções de tratamento. As fontes citadas não endossam este aplicativo. As lições, a narração, as legendas e os resumos das referências ficam disponíveis offline; os sites das fontes precisam de internet.',
    possibleBenefits: 'Possíveis benefícios',
    limitations: 'Limitações',
    professionalGuidance: 'Orientação profissional',
    fullTranscript: 'Transcrição completa',
    references: 'Referências',
    moreLessons: 'Mais lições',
    videoError: 'Não foi possível reproduzir este vídeo.',
    retry: 'Tentar novamente',
    retryVideo: 'Tentar reproduzir o vídeo novamente',
    couldNotOpenLink: 'Não foi possível abrir o link. Verifique sua conexão com a internet e tente novamente.',
    openWebsite: 'Abrir site da fonte',
    internetRequired: 'Requer internet',
    backToLessonLibrary: 'Voltar à lista de lições',
    backToCaregiverDashboard: 'Voltar ao painel do cuidador',
    openLesson: 'Abrir lição',
    durationTemplate: 'Animação de {seconds} s · {subtitles}: {language}',
  },
  zh: {
    title: '疗育指南',
    videoLabel: '视频：',
    notice: 'Huda 原创动画内置所选应用语言的合成旁白和字幕，可离线播放。这些是教育动画，不是临床演示。内容仅供一般参考，不用于诊断或治疗。所引来源不代表其认可本应用。课程、旁白、字幕和参考资料摘要可离线查看；打开来源网站需要联网。',
    possibleBenefits: '可能的帮助',
    limitations: '局限性',
    professionalGuidance: '专业指导',
    fullTranscript: '完整文本',
    references: '参考资料',
    moreLessons: '更多课程',
    videoError: '无法播放此视频。',
    retry: '重试',
    retryVideo: '重新尝试播放视频',
    couldNotOpenLink: '无法打开链接。请检查网络连接后重试。',
    openWebsite: '打开来源网站',
    internetRequired: '需要联网',
    backToLessonLibrary: '返回课程列表',
    backToCaregiverDashboard: '返回照护者面板',
    openLesson: '打开课程',
    durationTemplate: '{seconds} 秒动画 · {subtitles}：{language}',
  },
  hi: {
    title: 'थेरेपी मार्गदर्शिका',
    videoLabel: 'वीडियो:',
    notice: 'Huda के मूल एनिमेशन में ऐप की चुनी हुई भाषा का सिंथेटिक वर्णन और उपशीर्षक ऑफ़लाइन शामिल हैं। ये शैक्षिक एनिमेशन हैं, चिकित्सकीय प्रदर्शन नहीं। यह सामान्य जानकारी है—निदान या उपचार के निर्देश नहीं। उद्धृत स्रोत इस ऐप का समर्थन नहीं करते। पाठ, वर्णन, उपशीर्षक और संदर्भों के सारांश ऑफ़लाइन उपलब्ध हैं; स्रोत वेबसाइट खोलने के लिए इंटरनेट चाहिए।',
    possibleBenefits: 'संभावित लाभ',
    limitations: 'सीमाएँ',
    professionalGuidance: 'विशेषज्ञ की सलाह',
    fullTranscript: 'पूरा पाठ',
    references: 'संदर्भ',
    moreLessons: 'अन्य पाठ',
    videoError: 'यह वीडियो नहीं चल सका।',
    retry: 'फिर कोशिश करें',
    retryVideo: 'वीडियो फिर चलाने की कोशिश करें',
    couldNotOpenLink: 'लिंक नहीं खुला। अपना इंटरनेट कनेक्शन जाँचें और फिर कोशिश करें।',
    openWebsite: 'स्रोत वेबसाइट खोलें',
    internetRequired: 'इंटरनेट आवश्यक है',
    backToLessonLibrary: 'पाठ सूची पर वापस जाएँ',
    backToCaregiverDashboard: 'देखभालकर्ता डैशबोर्ड पर वापस जाएँ',
    openLesson: 'पाठ खोलें',
    durationTemplate: '{seconds} सेकंड का एनिमेशन · {subtitles}: {language}',
  },
};

const lessonTranslations: Record<Exclude<LanguageCode, 'en'>, Record<TherapyLessonId, LocalizedLesson>> = {
  es: {
    'speech-aac': {
      title: 'Habla, lenguaje y CAA', category: 'Comunicación',
      summary: 'Apoya la comprensión y la expresión mediante el habla, los gestos, las imágenes o un dispositivo de comunicación.',
      benefits: ['Más formas de expresar deseos, necesidades, elecciones y rechazos.', 'Apoyo para comprender el lenguaje y las conversaciones cotidianas.', 'Acceso a la comunicación incluso cuando hablar resulta difícil.'],
      limitations: 'La CAA y la terapia del habla y el lenguaje se adaptan a cada persona. La CAA no garantiza que aparezca el habla, y hablar no es el único resultado valioso.',
      professional: 'Un logopeda puede evaluar la comunicación y ayudar a elegir un sistema accesible.',
    },
    occupational: {
      title: 'Terapia ocupacional', category: 'Participación cotidiana',
      summary: 'Ayuda al niño a participar en las rutinas, el juego y el autocuidado de maneras que se ajusten a sus capacidades.',
      benefits: ['Apoyo para vestirse, comer y otras rutinas diarias.', 'Adaptaciones ante barreras motoras, sensoriales y del entorno.', 'Metas prácticas importantes en casa y en la escuela.'],
      limitations: 'La evidencia varía según la técnica de terapia ocupacional. Las actividades sensoriales no ayudan a todos los niños; las intervenciones sensoriales deben tener metas claras y revisarse.',
      professional: 'Un terapeuta ocupacional evalúa la participación y diseña un plan individual junto con el niño y la familia.',
    },
    play: {
      title: 'Apoyo al desarrollo mediante el juego', category: 'Vínculo y aprendizaje',
      summary: 'Usa juegos agradables y adecuados al desarrollo para apoyar la participación compartida y la comunicación.',
      benefits: ['Oportunidades para comunicarse en ambos sentidos y disfrutar juntos.', 'Aprendizaje a partir de los intereses y el juego cotidiano.', 'Los cuidadores pueden participar con orientación profesional.'],
      limitations: 'Los enfoques basados en el juego y sus resultados varían. Ningún programa específico es el mejor para todos los niños. Esta guía no enseña un protocolo terapéutico.',
      professional: 'Un profesional capacitado puede elegir con la familia estrategias adecuadas de comunicación social basadas en el juego.',
    },
    caregiver: {
      title: 'Orientación para cuidadores', category: 'Apoyo familiar',
      summary: 'Ayuda a los cuidadores a aprovechar las rutinas cotidianas para apoyar la participación, la comunicación y las habilidades para la vida diaria.',
      benefits: ['Oportunidades constantes de comunicación durante rutinas conocidas.', 'Orientación práctica relacionada con las prioridades familiares.', 'Apoyo para la participación, las habilidades diarias y las interacciones positivas.'],
      limitations: 'La orientación a cuidadores no sustituye la atención profesional. El programa de la OMS está dirigido a niños de 2 a 9 años con retrasos del desarrollo o discapacidades; consulta con servicios capacitados si es adecuado.',
      professional: 'Un facilitador capacitado o un profesional clínico adecuado puede orientar a la familia, adaptar las metas y revisar el progreso.',
    },
    behavior: {
      title: 'Apoyo conductual positivo y ABA', category: 'Seguridad y calidad de vida',
      summary: 'Comprende el malestar o las conductas inseguras y apoya habilidades útiles con atención individualizada y respetuosa.',
      benefits: ['Identificar necesidades de comunicación, salud o del entorno relacionadas con el malestar.', 'Apoyar una comunicación útil y alternativas más seguras.', 'Revisar resultados que mejoren la vida diaria, no solo la obediencia.'],
      limitations: 'El ABA y otros enfoques conductuales varían mucho y no son intercambiables. La evidencia y la aceptación difieren. Un diagnóstico de autismo, por sí solo, no indica si un enfoque es adecuado.',
      professional: 'Busca un equipo multidisciplinario cualificado o un profesional conductual que trabaje con el niño y la familia, tenga en cuenta su consentimiento y mida resultados significativos.',
    },
  },
  fr: {
    'speech-aac': {
      title: 'Parole, langage et CAA', category: 'Communication',
      summary: 'Favoriser la compréhension et l’expression par la parole, les gestes, les images ou un outil de communication.',
      benefits: ['Davantage de moyens d’exprimer des souhaits, des besoins, des choix et un refus.', 'Un soutien pour comprendre le langage et les échanges du quotidien.', 'Un accès à la communication même lorsque parler est difficile.'],
      limitations: 'La CAA et l’orthophonie sont adaptées à chaque personne. La CAA ne garantit pas l’apparition de la parole, et la parole n’est pas le seul résultat important.',
      professional: 'Un orthophoniste peut évaluer la communication et aider à choisir un système accessible.',
    },
    occupational: {
      title: 'Ergothérapie', category: 'Participation au quotidien',
      summary: 'Aider l’enfant à participer aux routines, aux jeux et aux soins personnels selon ses capacités.',
      benefits: ['Un soutien pour s’habiller, manger et suivre les routines quotidiennes.', 'Des adaptations face aux obstacles moteurs, sensoriels ou liés à l’environnement.', 'Des objectifs pratiques importants à la maison et à l’école.'],
      limitations: 'Les données varient selon les techniques d’ergothérapie. Les activités sensorielles ne conviennent pas à tous ; une intervention sensorielle devrait avoir des objectifs clairs et faire l’objet d’un suivi.',
      professional: 'Un ergothérapeute évalue la participation et construit un plan personnalisé avec l’enfant et sa famille.',
    },
    play: {
      title: 'Accompagnement du développement par le jeu', category: 'Lien et apprentissage',
      summary: 'S’appuyer sur des jeux plaisants et adaptés au développement pour favoriser l’engagement partagé et la communication.',
      benefits: ['Des occasions de communiquer dans les deux sens et de partager des moments agréables.', 'Des apprentissages liés aux intérêts de l’enfant et aux jeux du quotidien.', 'La participation des proches avec un accompagnement professionnel.'],
      limitations: 'Les approches par le jeu et leurs résultats varient. Aucun programme particulier ne convient le mieux à tous les enfants. Ce guide n’enseigne pas de protocole thérapeutique.',
      professional: 'Un professionnel formé peut choisir avec la famille des stratégies de communication sociale par le jeu qui conviennent à l’enfant.',
    },
    caregiver: {
      title: 'Accompagnement des proches aidants', category: 'Soutien familial',
      summary: 'Aider les proches à intégrer la communication, la participation et les compétences quotidiennes aux routines familières.',
      benefits: ['Des occasions régulières de communiquer au cours des routines connues.', 'Des conseils pratiques liés aux priorités de la famille.', 'Un soutien à l’engagement, aux compétences du quotidien et aux interactions positives.'],
      limitations: 'L’accompagnement des proches ne remplace pas les soins professionnels. Le programme de l’OMS concerne les enfants de 2 à 9 ans ayant un retard de développement ou un handicap ; discutez de sa pertinence avec des services formés.',
      professional: 'Un intervenant formé ou un professionnel de santé compétent peut accompagner la famille, adapter les objectifs et suivre les progrès.',
    },
    behavior: {
      title: 'Soutien comportemental positif et ABA', category: 'Sécurité et qualité de vie',
      summary: 'Comprendre la détresse ou les comportements dangereux et soutenir des compétences utiles avec un accompagnement personnalisé et respectueux.',
      benefits: ['Repérer les besoins de communication, de santé ou d’environnement liés à la détresse.', 'Soutenir une communication utile et des solutions plus sûres.', 'Suivre les résultats qui améliorent la vie quotidienne, au-delà de la seule obéissance.'],
      limitations: 'L’ABA et les autres approches comportementales sont très diverses et ne sont pas interchangeables. Les données et l’acceptabilité varient. Un diagnostic d’autisme ne suffit pas à déterminer si une approche convient.',
      professional: 'Faites appel à une équipe pluridisciplinaire qualifiée ou à un professionnel du comportement travaillant avec l’enfant et sa famille, respectant son assentiment et évaluant des résultats significatifs.',
    },
  },
  ar: {
    'speech-aac': {
      title: 'النطق واللغة والتواصل المعزز والبديل', category: 'التواصل',
      summary: 'دعم الفهم والتعبير بالكلام أو الإشارات أو الصور أو جهاز للتواصل.',
      benefits: ['طرق أكثر للتعبير عن الرغبات والاحتياجات والاختيارات والرفض.', 'دعم فهم اللغة والمحادثات اليومية.', 'إتاحة التواصل حتى عندما يكون الكلام صعبًا.'],
      limitations: 'يُخصص التواصل المعزز والبديل وعلاج النطق واللغة لكل شخص. لا يضمن التواصل المعزز ظهور الكلام، والكلام ليس النتيجة المهمة الوحيدة.',
      professional: 'يمكن لأخصائي النطق واللغة تقييم التواصل والمساعدة في اختيار نظام يسهل الوصول إليه.',
    },
    occupational: {
      title: 'العلاج الوظيفي', category: 'المشاركة في الحياة اليومية',
      summary: 'مساعدة الطفل على المشاركة في الروتين اليومي واللعب والعناية بالنفس بما يناسب قدراته.',
      benefits: ['دعم ارتداء الملابس وتناول الطعام والروتين اليومي الآخر.', 'تعديلات للعوائق الحركية والحسية والبيئية.', 'أهداف عملية مهمة في المنزل والمدرسة.'],
      limitations: 'تختلف الأدلة بحسب أساليب العلاج الوظيفي. ولا تفيد الأنشطة الحسية كل طفل؛ لذا ينبغي أن يكون للتدخل الحسي أهداف واضحة وأن تُراجع نتائجه.',
      professional: 'يقيّم أخصائي العلاج الوظيفي المشاركة ويضع خطة فردية بالتعاون مع الطفل والأسرة.',
    },
    play: {
      title: 'دعم النمو من خلال اللعب', category: 'التواصل والتعلم',
      summary: 'استخدام لعب ممتع وملائم للنمو لدعم المشاركة المشتركة والتواصل.',
      benefits: ['فرص للتواصل المتبادل والاستمتاع معًا.', 'التعلم من اهتمامات الطفل واللعب اليومي.', 'مشاركة مقدمي الرعاية بإرشاد من مختص.'],
      limitations: 'تختلف أساليب اللعب ونتائجها. ولا يوجد برنامج محدد هو الأفضل لكل طفل. لا يعلّم هذا الدليل بروتوكولًا علاجيًا بعينه.',
      professional: 'يمكن لمختص مدرّب اختيار استراتيجيات مناسبة للتواصل الاجتماعي عبر اللعب بالتعاون مع الأسرة.',
    },
    caregiver: {
      title: 'تدريب مقدمي الرعاية', category: 'دعم الأسرة',
      summary: 'مساعدة مقدمي الرعاية على استثمار الروتين اليومي لدعم المشاركة والتواصل ومهارات الحياة اليومية.',
      benefits: ['فرص منتظمة للتواصل ضمن أنشطة مألوفة.', 'إرشاد عملي يرتبط بأولويات الأسرة.', 'دعم المشاركة ومهارات الحياة اليومية والتفاعلات الإيجابية.'],
      limitations: 'لا يحل تدريب مقدمي الرعاية محل الرعاية المهنية. يستهدف برنامج منظمة الصحة العالمية الأطفال من عمر سنتين إلى 9 سنوات ممن لديهم تأخر نمائي أو إعاقة؛ ناقشوا ملاءمته مع خدمات مدرّبة.',
      professional: 'يمكن لميسّر مدرّب أو مختص مناسب إرشاد الأسرة وتكييف الأهداف ومراجعة التقدم.',
    },
    behavior: {
      title: 'دعم السلوك الإيجابي وتحليل السلوك التطبيقي', category: 'السلامة وجودة الحياة',
      summary: 'فهم الضيق أو السلوك غير الآمن ودعم مهارات مفيدة برعاية فردية تحترم الطفل.',
      benefits: ['تحديد احتياجات التواصل أو الصحة أو البيئة المرتبطة بالضيق.', 'دعم تواصل مفيد وبدائل أكثر أمانًا.', 'مراجعة نتائج تحسن الحياة اليومية، لا الطاعة وحدها.'],
      limitations: 'تختلف أساليب تحليل السلوك التطبيقي وغيرها كثيرًا، ولا يمكن اعتبارها متطابقة. كما تختلف الأدلة ومدى قبولها. ولا يكفي تشخيص التوحد وحده لتحديد ملاءمة أسلوب معين.',
      professional: 'استعن بفريق مؤهل متعدد التخصصات أو مختص سلوكي يعمل مع الطفل والأسرة، ويراعي موافقة الطفل ويقيس نتائج مهمة.',
    },
  },
  de: {
    'speech-aac': {
      title: 'Sprache, Sprechen und Unterstützte Kommunikation', category: 'Kommunikation',
      summary: 'Verständnis und Ausdruck durch Sprache, Gesten, Bilder oder ein Kommunikationsgerät fördern.',
      benefits: ['Mehr Möglichkeiten, Wünsche, Bedürfnisse, Entscheidungen und Ablehnung auszudrücken.', 'Unterstützung beim Sprachverständnis und bei Gesprächen im Alltag.', 'Kommunikationszugang auch dann, wenn Sprechen schwierig ist.'],
      limitations: 'Unterstützte Kommunikation und Sprachtherapie werden individuell angepasst. Unterstützte Kommunikation garantiert keine Lautsprache; Sprechen ist nicht das einzige bedeutsame Ergebnis.',
      professional: 'Eine Fachkraft für Sprachtherapie kann die Kommunikation einschätzen und bei der Wahl eines zugänglichen Systems helfen.',
    },
    occupational: {
      title: 'Ergotherapie', category: 'Teilhabe im Alltag',
      summary: 'Das Kind dabei unterstützen, passend zu seinen Fähigkeiten an Routinen, Spiel und Selbstversorgung teilzunehmen.',
      benefits: ['Unterstützung beim Anziehen, Essen und anderen Alltagsroutinen.', 'Anpassungen bei motorischen, sensorischen und umgebungsbedingten Hindernissen.', 'Praktische Ziele, die zu Hause und in der Schule wichtig sind.'],
      limitations: 'Die Evidenz unterscheidet sich je nach ergotherapeutischer Methode. Sensorische Aktivitäten helfen nicht jedem Kind; sensorische Interventionen sollten klare Ziele haben und überprüft werden.',
      professional: 'Eine Ergotherapie-Fachkraft beurteilt die Teilhabe und entwickelt gemeinsam mit Kind und Familie einen individuellen Plan.',
    },
    play: {
      title: 'Entwicklungsförderung durch Spiel', category: 'Beziehung und Lernen',
      summary: 'Angenehmes, entwicklungsgerechtes Spiel nutzen, um gemeinsame Beteiligung und Kommunikation zu unterstützen.',
      benefits: ['Gelegenheiten für wechselseitige Kommunikation und gemeinsame Freude.', 'Lernen durch Interessen und alltägliches Spiel.', 'Betreuungspersonen können mit fachlicher Begleitung mitwirken.'],
      limitations: 'Spielbasierte Ansätze und ihre Ergebnisse unterscheiden sich. Kein einzelnes Markenprogramm ist für jedes Kind am besten. Dieser Ratgeber vermittelt kein bestimmtes Therapieprotokoll.',
      professional: 'Eine geschulte Fachkraft kann gemeinsam mit der Familie passende spielbasierte Strategien für soziale Kommunikation auswählen.',
    },
    caregiver: {
      title: 'Coaching für Betreuungspersonen', category: 'Unterstützung für Familien',
      summary: 'Betreuungspersonen dabei unterstützen, Kommunikation, Beteiligung und Alltagsfähigkeiten in vertraute Routinen einzubetten.',
      benefits: ['Regelmäßige Kommunikationsgelegenheiten in vertrauten Routinen.', 'Praktische Begleitung nach den Prioritäten der Familie.', 'Unterstützung von Beteiligung, Alltagsfähigkeiten und positiven Interaktionen.'],
      limitations: 'Coaching für Betreuungspersonen ersetzt keine professionelle Versorgung. Das WHO-Paket richtet sich an Kinder von 2 bis 9 Jahren mit Entwicklungsverzögerungen oder Behinderungen; besprecht die Eignung mit geschulten Diensten.',
      professional: 'Eine geschulte Fachkraft oder eine geeignete klinische Fachperson kann die Familie begleiten, Ziele anpassen und Fortschritte überprüfen.',
    },
    behavior: {
      title: 'Positive Verhaltensunterstützung und ABA', category: 'Sicherheit und Lebensqualität',
      summary: 'Belastung oder unsicheres Verhalten verstehen und nützliche Fähigkeiten durch individuelle, respektvolle Unterstützung fördern.',
      benefits: ['Kommunikations-, Gesundheits- oder Umgebungsbedürfnisse hinter Belastung erkennen.', 'Nützliche Kommunikation und sicherere Alternativen unterstützen.', 'Ergebnisse überprüfen, die den Alltag verbessern – nicht nur Gehorsam.'],
      limitations: 'ABA und andere verhaltensorientierte Ansätze unterscheiden sich stark und sind nicht austauschbar. Evidenz und Akzeptanz variieren. Eine Autismusdiagnose allein zeigt nicht, ob ein bestimmter Ansatz geeignet ist.',
      professional: 'Wende dich an ein qualifiziertes, interdisziplinäres Team oder eine Fachkraft für Verhalten, die mit Kind und Familie arbeitet, Zustimmung berücksichtigt und sinnvolle Ergebnisse misst.',
    },
  },
  pt: {
    'speech-aac': {
      title: 'Fala, linguagem e CAA', category: 'Comunicação',
      summary: 'Apoiar a compreensão e a expressão por meio da fala, de gestos, imagens ou de um dispositivo de comunicação.',
      benefits: ['Mais maneiras de expressar desejos, necessidades, escolhas e recusas.', 'Apoio para compreender a linguagem e as conversas do dia a dia.', 'Acesso à comunicação mesmo quando falar é difícil.'],
      limitations: 'A CAA e a terapia da fala e da linguagem são individualizadas. A CAA não garante o desenvolvimento da fala, e falar não é o único resultado significativo.',
      professional: 'Um fonoaudiólogo pode avaliar a comunicação e ajudar a escolher um sistema acessível.',
    },
    occupational: {
      title: 'Terapia ocupacional', category: 'Participação no dia a dia',
      summary: 'Ajudar a criança a participar das rotinas, das brincadeiras e do autocuidado de formas adequadas às suas habilidades.',
      benefits: ['Apoio para vestir-se, comer e realizar outras rotinas diárias.', 'Adaptações para barreiras motoras, sensoriais e ambientais.', 'Metas práticas importantes em casa e na escola.'],
      limitations: 'As evidências variam conforme a técnica de terapia ocupacional. Atividades sensoriais não ajudam todas as crianças; intervenções sensoriais devem ter metas claras e seus efeitos precisam ser avaliados.',
      professional: 'Um terapeuta ocupacional avalia a participação e cria um plano individualizado com a criança e a família.',
    },
    play: {
      title: 'Apoio ao desenvolvimento por meio de brincadeiras', category: 'Vínculo e aprendizagem',
      summary: 'Usar brincadeiras agradáveis e adequadas ao desenvolvimento para apoiar a participação compartilhada e a comunicação.',
      benefits: ['Oportunidades de comunicação recíproca e diversão compartilhada.', 'Aprendizagem a partir dos interesses e das brincadeiras do dia a dia.', 'Cuidadores podem participar com orientação profissional.'],
      limitations: 'As abordagens baseadas em brincadeiras e seus resultados variam. Nenhum programa específico é o melhor para todas as crianças. Este guia não ensina um protocolo terapêutico.',
      professional: 'Um profissional capacitado pode escolher com a família estratégias de comunicação social por meio de brincadeiras adequadas.',
    },
    caregiver: {
      title: 'Orientação para cuidadores', category: 'Apoio à família',
      summary: 'Ajudar cuidadores a aproveitar rotinas conhecidas para apoiar participação, comunicação e habilidades para a vida diária.',
      benefits: ['Oportunidades consistentes de comunicação durante rotinas familiares.', 'Orientação prática ligada às prioridades da família.', 'Apoio à participação, às habilidades diárias e às interações positivas.'],
      limitations: 'A orientação a cuidadores não substitui o atendimento profissional. O programa da OMS é voltado a crianças de 2 a 9 anos com atrasos no desenvolvimento ou deficiências; converse com serviços capacitados sobre a adequação.',
      professional: 'Um facilitador capacitado ou profissional clínico adequado pode orientar a família, adaptar metas e acompanhar o progresso.',
    },
    behavior: {
      title: 'Apoio comportamental positivo e ABA', category: 'Segurança e qualidade de vida',
      summary: 'Compreender o sofrimento ou comportamentos inseguros e apoiar habilidades úteis com cuidado individualizado e respeitoso.',
      benefits: ['Identificar necessidades de comunicação, saúde ou ambiente associadas ao sofrimento.', 'Apoiar uma comunicação útil e alternativas mais seguras.', 'Avaliar resultados que melhorem a vida diária, não apenas a obediência.'],
      limitations: 'A ABA e outras abordagens comportamentais variam muito e não são intercambiáveis. As evidências e a aceitação diferem. Um diagnóstico de autismo, por si só, não determina se uma abordagem específica é adequada.',
      professional: 'Procure uma equipe multidisciplinar qualificada ou um profissional de comportamento que trabalhe com a criança e a família, considere o assentimento e avalie resultados significativos.',
    },
  },
  zh: {
    'speech-aac': {
      title: '言语、语言与辅助沟通', category: '沟通',
      summary: '通过说话、手势、图片或沟通设备，支持孩子理解和表达。',
      benefits: ['提供更多表达愿望、需要、选择和拒绝的方式。', '支持理解语言和日常对话。', '即使说话困难，也能获得沟通方式。'],
      limitations: '辅助沟通和言语语言治疗都应因人而异。辅助沟通不能保证孩子会开始说话，说话也不是唯一有意义的结果。',
      professional: '言语语言治疗师可以评估沟通情况，并帮助选择方便使用的沟通系统。',
    },
    occupational: {
      title: '作业治疗', category: '日常参与',
      summary: '帮助孩子按照自身能力参与日常活动、游戏和自我照护。',
      benefits: ['支持穿衣、吃饭及其他日常活动。', '针对动作、感官和环境障碍进行调整。', '制定对家庭和学校生活有意义的实际目标。'],
      limitations: '不同作业治疗方法的证据各不相同。感官活动并不适合每个孩子；感官干预应有明确目标，并持续评估效果。',
      professional: '作业治疗师会评估孩子的参与情况，并与孩子和家人共同制定个别计划。',
    },
    play: {
      title: '以游戏支持发展', category: '联结与学习',
      summary: '使用有趣且符合发展阶段的游戏，支持共同参与和沟通。',
      benefits: ['创造双向沟通和共同享受乐趣的机会。', '利用孩子的兴趣和日常游戏进行学习。', '照护者可在专业指导下参与。'],
      limitations: '以游戏为基础的方法及其结果各不相同。没有一种特定项目适合所有孩子。本指南不教授特定治疗流程。',
      professional: '受过培训的专业人士可与家庭一起选择适合孩子的游戏式社交沟通策略。',
    },
    caregiver: {
      title: '照护者技能指导', category: '家庭支持',
      summary: '帮助照护者在熟悉的日常活动中支持孩子参与、沟通和生活技能。',
      benefits: ['在熟悉的日常活动中持续创造沟通机会。', '根据家庭优先事项提供实用指导。', '支持参与、日常生活技能和积极互动。'],
      limitations: '照护者指导不能替代专业照护。世卫组织项目面向有发育迟缓或残障的 2 至 9 岁儿童；请与受过培训的服务人员讨论是否适合。',
      professional: '受过培训的指导者或合适的临床专业人士可以指导家庭、调整目标并回顾进展。',
    },
    behavior: {
      title: '积极行为支持与 ABA', category: '安全与生活质量',
      summary: '理解痛苦或不安全行为的原因，并以尊重个体的方式支持有用的技能。',
      benefits: ['发现与痛苦相关的沟通、健康或环境需求。', '支持有用的沟通方式和更安全的替代行为。', '关注能改善日常生活的结果，而不只是服从。'],
      limitations: 'ABA 和其他行为方法差异很大，不能互相等同。证据和接受程度也各不相同。仅凭自闭症诊断无法判断某种方法是否适合。',
      professional: '选择合格的多学科团队或行为专业人士；他们应与孩子和家庭合作、尊重孩子的意愿，并衡量有意义的结果。',
    },
  },
  hi: {
    'speech-aac': {
      title: 'बोलना, भाषा और सहायक संवाद', category: 'संवाद',
      summary: 'बोलने, इशारों, तस्वीरों या संवाद उपकरण से समझने और अपनी बात कहने में सहायता करें।',
      benefits: ['इच्छा, ज़रूरत, पसंद और मना करने के अधिक तरीके।', 'भाषा समझने और रोज़मर्रा की बातचीत में सहायता।', 'बोलना कठिन होने पर भी संवाद का साधन।'],
      limitations: 'सहायक संवाद और वाणी-भाषा चिकित्सा हर व्यक्ति के अनुसार होती है। सहायक संवाद बोलना शुरू होने की गारंटी नहीं देता, और बोलना ही एकमात्र सार्थक परिणाम नहीं है।',
      professional: 'वाणी-भाषा विशेषज्ञ संवाद का आकलन करके सुलभ प्रणाली चुनने में मदद कर सकते हैं।',
    },
    occupational: {
      title: 'व्यावसायिक चिकित्सा', category: 'रोज़मर्रा की भागीदारी',
      summary: 'बच्चे की क्षमताओं के अनुरूप दिनचर्या, खेल और स्वयं की देखभाल में भाग लेने में मदद करें।',
      benefits: ['कपड़े पहनने, खाने और अन्य दैनिक कामों में सहायता।', 'शारीरिक, संवेदी और वातावरण संबंधी बाधाओं के लिए बदलाव।', 'घर और स्कूल में महत्वपूर्ण व्यावहारिक लक्ष्य।'],
      limitations: 'व्यावसायिक चिकित्सा की अलग-अलग तकनीकों के प्रमाण अलग हैं। संवेदी गतिविधियाँ हर बच्चे की मदद नहीं करतीं; ऐसे हस्तक्षेप के स्पष्ट लक्ष्य हों और उसके प्रभाव की समीक्षा की जाए।',
      professional: 'व्यावसायिक चिकित्सक भागीदारी का आकलन करके बच्चे और परिवार के साथ व्यक्तिगत योजना बनाते हैं।',
    },
    play: {
      title: 'खेल के माध्यम से विकास में सहायता', category: 'जुड़ाव और सीखना',
      summary: 'साझा भागीदारी और संवाद को बढ़ावा देने के लिए आनंददायक, विकास के अनुकूल खेल का उपयोग करें।',
      benefits: ['दोतरफ़ा संवाद और साथ में आनंद के अवसर।', 'बच्चे की रुचियों और रोज़मर्रा के खेल में सीखना।', 'विशेषज्ञ के मार्गदर्शन से देखभालकर्ता भी भाग ले सकते हैं।'],
      limitations: 'खेल-आधारित तरीके और उनके परिणाम अलग-अलग होते हैं। कोई एक खास कार्यक्रम हर बच्चे के लिए सर्वोत्तम नहीं है। यह मार्गदर्शिका किसी विशिष्ट चिकित्सा-पद्धति के निर्देश नहीं देती।',
      professional: 'प्रशिक्षित विशेषज्ञ परिवार के साथ बच्चे के लिए उपयुक्त खेल-आधारित सामाजिक संवाद की रणनीतियाँ चुन सकते हैं।',
    },
    caregiver: {
      title: 'देखभालकर्ता कौशल मार्गदर्शन', category: 'परिवार का सहारा',
      summary: 'परिचित दिनचर्या के ज़रिए भागीदारी, संवाद और दैनिक जीवन के कौशलों को सहारा देने में देखभालकर्ताओं की मदद करें।',
      benefits: ['परिचित दिनचर्या में संवाद के लगातार अवसर।', 'परिवार की प्राथमिकताओं से जुड़ा व्यावहारिक मार्गदर्शन।', 'भागीदारी, दैनिक कौशल और सकारात्मक बातचीत में सहायता।'],
      limitations: 'देखभालकर्ता मार्गदर्शन पेशेवर देखभाल का विकल्प नहीं है। WHO का कार्यक्रम विकास में देरी या दिव्यांगता वाले 2 से 9 वर्ष के बच्चों के लिए है; प्रशिक्षित सेवाओं से इसकी उपयुक्तता पर बात करें।',
      professional: 'प्रशिक्षित मार्गदर्शक या उपयुक्त चिकित्सक परिवार को मार्गदर्शन देकर लक्ष्य बदल सकते हैं और प्रगति की समीक्षा कर सकते हैं।',
    },
    behavior: {
      title: 'सकारात्मक व्यवहार सहायता और ABA', category: 'सुरक्षा और जीवन की गुणवत्ता',
      summary: 'परेशानी या असुरक्षित व्यवहार को समझें और व्यक्तिगत, सम्मानजनक देखभाल से उपयोगी कौशलों को सहारा दें।',
      benefits: ['परेशानी के पीछे संवाद, स्वास्थ्य या वातावरण की ज़रूरतें पहचानें।', 'काम के संवाद और सुरक्षित विकल्पों को सहारा दें।', 'सिर्फ आज्ञापालन नहीं, रोज़मर्रा की ज़िंदगी बेहतर करने वाले परिणाम देखें।'],
      limitations: 'ABA और अन्य व्यवहार-आधारित तरीके बहुत अलग होते हैं और एक-दूसरे के समान नहीं हैं। प्रमाण और स्वीकार्यता भी अलग-अलग हैं। केवल ऑटिज़्म का निदान यह तय नहीं करता कि कोई तरीका उपयुक्त है या नहीं।',
      professional: 'योग्य बहु-विषयक टीम या व्यवहार विशेषज्ञ से सहायता लें, जो बच्चे और परिवार के साथ काम करे, बच्चे की सहमति का ध्यान रखे और सार्थक परिणाम मापे।',
    },
  },
};

const referenceSummaryTranslations: Record<Exclude<LanguageCode, 'en'>, Record<TherapyReferenceId, string>> = {
  es: {
    cdc: 'Describe terapias del habla y el lenguaje, ocupacionales, del desarrollo y conductuales. Recomienda elegir apoyos según las necesidades de cada persona, no aplicar un único tratamiento a todos.',
    asha: 'Explica los gestos, las imágenes, los tableros de comunicación y los dispositivos que generan habla. La CAA no exige hitos previos y puede apoyar el lenguaje junto con el habla. Un logopeda puede evaluar y adaptar el acceso.',
    nice: 'La sección 1.3.1 recomienda apoyo profesional mediante el juego, adecuado al desarrollo y con participación de cuidadores. Las secciones 1.4.1–1.4.9 destacan la comunicación, la salud, el entorno, la evaluación funcional y los objetivos de calidad de vida ante el malestar o conductas inseguras.',
    who: 'Describe un programa estructurado de formación para familias de niños de 2 a 9 años. Busca apoyar la participación, la comunicación, la conducta positiva y las habilidades diarias mediante actividades cotidianas y facilitadores capacitados.',
    aap: 'Informe clínico sobre apoyos individualizados, condiciones concurrentes, comunicación e intervenciones. Trata las limitaciones de la evidencia y la importancia de vincular los servicios a metas funcionales y revisar los resultados.',
  },
  fr: {
    cdc: 'Présente l’orthophonie, l’ergothérapie, les approches développementales et comportementales. Recommande de choisir les aides selon les besoins de chaque personne, plutôt qu’un traitement unique pour tous.',
    asha: 'Explique les gestes, les images, les tableaux de communication et les appareils générateurs de parole. La CAA ne nécessite aucun acquis préalable et peut soutenir le langage en complément de la parole. Un orthophoniste peut évaluer et adapter l’accès.',
    nice: 'La section 1.3.1 recommande un accompagnement professionnel par le jeu, adapté au développement et avec la participation des proches. Les sections 1.4.1–1.4.9 soulignent les besoins de communication, la santé, l’environnement, l’évaluation fonctionnelle et les objectifs de qualité de vie en cas de détresse ou de danger.',
    who: 'Présente un programme structuré destiné aux familles d’enfants de 2 à 9 ans. Il vise à soutenir l’engagement, la communication, les comportements positifs et les compétences quotidiennes dans les activités de tous les jours, avec des intervenants formés.',
    aap: 'Rapport clinique sur l’accompagnement personnalisé, les conditions associées, la communication et les interventions. Il aborde les limites des données et le lien nécessaire entre les services, les objectifs fonctionnels et le suivi des résultats.',
  },
  ar: {
    cdc: 'يعرض علاج النطق واللغة والعلاج الوظيفي والأساليب النمائية والسلوكية. ويؤكد اختيار الدعم وفق احتياجات كل فرد بدلًا من استخدام علاج واحد للجميع.',
    asha: 'يشرح الإشارات والصور ولوحات التواصل وأجهزة توليد الكلام. لا يتطلب التواصل المعزز والبديل مهارات مسبقة، ويمكنه دعم اللغة إلى جانب الكلام. يستطيع أخصائي النطق واللغة تقييم وسيلة التواصل وتكييفها.',
    nice: 'يوصي القسم 1.3.1 بدعم مهني للتواصل الاجتماعي قائم على اللعب، ملائم للنمو وبمشاركة مقدم الرعاية. وتؤكد الأقسام 1.4.1–1.4.9 احتياجات التواصل والصحة والبيئة والتقييم الوظيفي وأهداف جودة الحياة عند التعامل مع الضيق أو السلوك غير الآمن.',
    who: 'يصف برنامجًا منظمًا لتدريب أسر الأطفال من عمر سنتين إلى 9 سنوات. ويهدف إلى دعم المشاركة والتواصل والسلوك الإيجابي ومهارات الحياة اليومية من خلال أنشطة مألوفة وبمساعدة ميسّرين مدرّبين.',
    aap: 'تقرير سريري عن الدعم الفردي والحالات المصاحبة والتواصل والتدخلات. ويناقش حدود الأدلة وأهمية ربط الخدمات بأهداف عملية ومراجعة النتائج.',
  },
  de: {
    cdc: 'Beschreibt Sprachtherapie, Ergotherapie sowie entwicklungsbezogene und verhaltensorientierte Ansätze. Unterstützungsangebote sollten auf die individuellen Bedürfnisse abgestimmt werden, statt eine Behandlung für alle anzunehmen.',
    asha: 'Erklärt Gesten, Bilder, Kommunikationstafeln und sprachgenerierende Geräte. Unterstützte Kommunikation setzt keine Vorstufen voraus und kann Sprache parallel zur Lautsprache fördern. Eine Fachkraft für Sprachtherapie kann den Zugang beurteilen und anpassen.',
    nice: 'Abschnitt 1.3.1 empfiehlt professionelle, spielbasierte und entwicklungsgerechte Unterstützung sozialer Kommunikation unter Beteiligung der Betreuungspersonen. Abschnitte 1.4.1–1.4.9 betonen Kommunikation, Gesundheit, Umgebung, funktionale Einschätzung und Lebensqualitätsziele bei Belastung oder unsicherem Verhalten.',
    who: 'Beschreibt ein strukturiertes Trainingspaket für Familien von Kindern zwischen 2 und 9 Jahren. Es soll Beteiligung, Kommunikation, positives Verhalten und Alltagsfähigkeiten durch vertraute Aktivitäten und geschulte Fachkräfte unterstützen.',
    aap: 'Klinischer Bericht über individuelle Unterstützung, Begleiterkrankungen, Kommunikation und Interventionen. Er behandelt Grenzen der Evidenz und die Bedeutung funktionaler Ziele sowie der Überprüfung von Ergebnissen.',
  },
  pt: {
    cdc: 'Descreve terapias da fala e da linguagem, terapia ocupacional e abordagens desenvolvimentais e comportamentais. Recomenda escolher o apoio conforme as necessidades de cada pessoa, sem presumir que exista um tratamento único para todos.',
    asha: 'Explica gestos, imagens, quadros de comunicação e dispositivos que geram fala. A CAA não exige habilidades prévias e pode apoiar a linguagem junto com a fala. Um fonoaudiólogo pode avaliar e adaptar o acesso.',
    nice: 'A seção 1.3.1 recomenda apoio profissional à comunicação social por meio de brincadeiras, adequado ao desenvolvimento e com participação dos cuidadores. As seções 1.4.1–1.4.9 destacam comunicação, saúde, ambiente, avaliação funcional e metas de qualidade de vida diante de sofrimento ou comportamento inseguro.',
    who: 'Descreve um programa estruturado para famílias de crianças de 2 a 9 anos. Busca apoiar participação, comunicação, comportamento positivo e habilidades diárias por meio de atividades cotidianas e facilitadores capacitados.',
    aap: 'Relatório clínico sobre apoio individualizado, condições associadas, comunicação e intervenções. Discute limites das evidências e a importância de relacionar os serviços a metas funcionais e acompanhar os resultados.',
  },
  zh: {
    cdc: '介绍言语语言治疗、作业治疗、发展支持和行为支持。建议根据个人需要选择帮助，而不是认为所有人都适合同一种治疗。',
    asha: '介绍手势、图片、沟通板和语音生成设备。辅助沟通不需要先达到某些发展里程碑，也可以与口语一起支持语言发展。言语语言治疗师可以评估并调整使用方式。',
    nice: '第 1.3.1 节建议由专业人员提供符合发展阶段、以游戏为基础并有照护者参与的社交沟通支持。第 1.4.1–1.4.9 节强调沟通需要、身体健康、环境、功能评估，以及应对痛苦或不安全行为时的生活质量目标。',
    who: '介绍面向 2 至 9 岁儿童家庭的结构化照护者培训项目。项目通过日常活动和受训指导者，支持参与、沟通、积极行为和生活技能。',
    aap: '一份关于个别化支持、伴随状况、沟通和干预的临床报告。报告讨论证据的局限，以及服务应围绕实际目标并持续评估结果。',
  },
  hi: {
    cdc: 'वाणी-भाषा चिकित्सा, व्यावसायिक चिकित्सा तथा विकास और व्यवहार से जुड़े तरीकों का वर्णन करता है। सभी के लिए एक ही उपचार मानने के बजाय व्यक्ति की ज़रूरत के अनुसार सहायता चुनने पर ज़ोर देता है।',
    asha: 'इशारों, तस्वीरों, संवाद बोर्ड और बोलने वाले उपकरणों की जानकारी देता है। सहायक संवाद के लिए पहले किसी पड़ाव तक पहुँचना ज़रूरी नहीं, और यह बोलने के साथ भाषा को सहारा दे सकता है। वाणी-भाषा विशेषज्ञ पहुँच का आकलन करके तरीका अनुकूल कर सकते हैं।',
    nice: 'खंड 1.3.1 देखभालकर्ता की भागीदारी के साथ, विकास के अनुकूल खेल-आधारित सामाजिक संवाद सहायता की सिफारिश करता है। खंड 1.4.1–1.4.9 परेशानी या असुरक्षित व्यवहार में संवाद, स्वास्थ्य, वातावरण, कार्यात्मक आकलन और जीवन-गुणवत्ता के लक्ष्यों पर ज़ोर देते हैं।',
    who: '2 से 9 वर्ष के बच्चों के परिवारों के लिए संरचित देखभालकर्ता प्रशिक्षण कार्यक्रम का वर्णन करता है। प्रशिक्षित मार्गदर्शकों और रोज़मर्रा की गतिविधियों से भागीदारी, संवाद, सकारात्मक व्यवहार और दैनिक कौशलों को सहारा देना इसका उद्देश्य है।',
    aap: 'व्यक्तिगत सहायता, साथ की स्थितियों, संवाद और हस्तक्षेपों पर एक चिकित्सकीय रिपोर्ट। यह प्रमाणों की सीमाओं और व्यावहारिक लक्ष्यों से सेवाएँ जोड़कर परिणामों की समीक्षा करने की ज़रूरत पर चर्चा करती है।',
  },
};

export function getTherapyGuideCopy(language: LanguageCode): TherapyGuideCopy {
  return guideCopy[language];
}

export function localizeTherapyLesson(lesson: TherapyLesson, language: LanguageCode): TherapyLesson {
  if (language === 'en') return lesson;
  const localized = lessonTranslations[language][lesson.id as TherapyLessonId];
  return localized ? { ...lesson, ...localized } : lesson;
}

export function localizeTherapyReferenceSummary(
  referenceId: string,
  englishSummary: string,
  language: LanguageCode,
): string {
  if (language === 'en') return englishSummary;
  return referenceSummaryTranslations[language][referenceId as TherapyReferenceId] ?? englishSummary;
}

