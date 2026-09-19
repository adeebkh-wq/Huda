import type { LanguageCode } from './translations';

export interface AutismSubsection {
  label: string;
  items: string[];
}

export interface AutismSection {
  id: string;
  icon: string;
  color: string;
  title: string;
  body?: string;
  subsections?: AutismSubsection[];
  items?: string[];
  body2?: string;
  note?: string;
  source?: string;
}

export interface AutismPageContent {
  screenTitle: string;
  banner: string;
  sections: AutismSection[];
  footer: string;
}

// ── Base colours & icons (language-independent) ───────────────────────────────
const SECTION_META = [
  { id: 'what',          icon: 'information-circle-outline', color: '#2B78BE' },
  { id: 'early',         icon: 'calendar-outline',           color: '#E07B39' },
  { id: 'communication', icon: 'chatbubbles-outline',         color: '#2A9D8F' },
  { id: 'sensory',       icon: 'ear-outline',                color: '#7C4DBC' },
  { id: 'strengths',     icon: 'star-outline',               color: '#E9A820' },
  { id: 'help',          icon: 'heart-outline',              color: '#E05C6A' },
] as const;

// ── English (default) ─────────────────────────────────────────────────────────
const EN: AutismPageContent = {
  screenTitle: 'Understanding Autism',
  banner: 'Every autistic person is unique. This guide is a starting point — not a checklist. Always work with qualified professionals for diagnosis and support.',
  footer: 'Information compiled from the CDC, NIMH, AAP, Autistica, ASHA, Autism Speaks, and peer-reviewed research. For medical advice, consult a qualified healthcare provider.',
  sections: [
    {
      ...SECTION_META[0],
      title: 'What is Autism?',
      body: "Autism Spectrum Disorder (ASD) is a neurological and developmental condition that affects how a person communicates, interacts, learns, and behaves.\n\nIt is called a \"spectrum\" because it looks different in every person — some autistic individuals need significant daily support, while others live fully independently. There is no single \"type\" of autism.\n\nAutism is not caused by parenting, vaccines, or diet. Research points to a combination of genetic and environmental factors that influence how the brain develops.\n\nMost importantly: autism is a difference, not a defect. Autistic people experience the world in a unique and valid way.",
      source: 'Source: CDC, NIMH',
    },
    {
      ...SECTION_META[1],
      title: 'Early Signs by Age',
      subsections: [
        { label: 'By 12 months', items: ['Does not respond to their name', 'No babbling or cooing', 'No back-and-forth gestures (waving, pointing, reaching)', 'Little or no eye contact'] },
        { label: 'By 18 months', items: ['No single words spoken', 'Does not point to show interest in something', 'Does not imitate others\' actions', 'Loss of speech or skills they previously had'] },
        { label: 'By 24 months', items: ['No two-word meaningful phrases', 'Does not notice other children or join in play', 'Very limited pretend play', 'Unusual attachment to specific objects'] },
        { label: 'Any age — additional signs', items: ['Avoids eye contact or physical touch', 'Prefers to play alone rather than with others', 'Repeats words or phrases (echolalia)', 'Gets very upset by small changes in routine', 'Repetitive movements: hand-flapping, rocking, spinning', 'Intense, focused interest in specific topics', 'Over or under sensitivity to sounds, lights, textures, or smells'] },
      ],
      note: 'These signs do not confirm autism on their own. A formal evaluation by a specialist is always needed. Early identification — even before age 2 — leads to the best outcomes.',
      source: 'Source: CDC, American Academy of Pediatrics (AAP)',
    },
    {
      ...SECTION_META[2],
      title: 'Communication & Social Differences',
      items: ['Difficulty starting or maintaining conversations', 'Trouble understanding jokes, sarcasm, or figurative language', 'May not use gestures to communicate (pointing, waving)', 'Differences in tone, rhythm, or volume of speech', "Challenges understanding others' emotions or perspective", 'May prefer written or visual communication over spoken words', 'Some autistic children are non-speaking or minimally verbal — this does not reflect intelligence'],
      body: 'AAC (Augmentative and Alternative Communication) tools — like picture boards, speech-generating devices, and apps like Huda — are widely used to support autistic individuals who communicate differently.',
      source: 'Source: ASHA, CDC',
    },
    {
      ...SECTION_META[3],
      title: 'Sensory Differences',
      body: 'Many autistic people process sensory information differently from neurotypical people. This is sometimes called sensory processing differences.\n\nThey may be hypersensitive (over-responsive) or hyposensitive (under-responsive) to:',
      items: ['Sound — certain noises feel painfully loud or impossible to filter out', 'Touch — clothing textures, hugs, or light brushing can feel overwhelming', 'Light — bright or flickering lights cause discomfort or distress', 'Taste & smell — strong reactions to certain foods or scents', 'Movement — seeking or avoiding spinning, swinging, or pressure'],
      body2: "Sensory overload is real and can be exhausting. What looks like a behavioural outburst is often a sensory response. Creating a calm, predictable sensory environment — as Huda's Sensory Games aim to do — can make a meaningful difference.",
      source: 'Source: Autism Speaks, STAR Institute',
    },
    {
      ...SECTION_META[4],
      title: 'Strengths & Abilities',
      body: 'Autism brings genuine strengths. While every autistic person is different, these are commonly reported:',
      items: ['Exceptional memory, especially for facts and details', 'Deep expertise and passion in areas of interest', 'Strong pattern recognition and logical thinking', 'Honest, direct communication — no hidden agenda', 'Attention to detail that others miss', 'Creative and original thinking', 'Loyalty and deep commitment to people they trust', 'Ability to focus intensely on tasks they care about'],
      body2: 'Research increasingly recognises autistic strengths as assets in fields like technology, science, arts, and mathematics. Neurodiversity is a strength for society as a whole.',
      source: 'Source: Autistica, Frontiers in Psychiatry (2023)',
    },
    {
      ...SECTION_META[5],
      title: 'When & How to Seek Help',
      body: 'If you notice any signs of autism in your child — at any age — speak to a paediatrician. Trust your instincts. Early support makes the most difference.\n\nScreening is recommended by the American Academy of Pediatrics (AAP) at:',
      items: ['9 months — general developmental screening', '18 months — autism-specific screening', '24 months — autism-specific screening', 'Any time a concern arises'],
      body2: 'Early intervention services — speech therapy, occupational therapy, ABA, and AAC support — have been shown to significantly improve communication, independence, and quality of life.\n\nA diagnosis is not a ceiling. It is a door to the right support.',
      source: 'Source: AAP, CDC',
    },
  ],
};

// ── Spanish ───────────────────────────────────────────────────────────────────
const ES: AutismPageContent = {
  screenTitle: 'Entendiendo el Autismo',
  banner: 'Cada persona autista es única. Esta guía es un punto de partida, no una lista de verificación. Trabaja siempre con profesionales calificados para el diagnóstico y apoyo.',
  footer: 'Información recopilada de los CDC, NIMH, AAP, Autistica, ASHA, Autism Speaks e investigaciones revisadas por expertos. Para asesoramiento médico, consulta a un profesional de salud calificado.',
  sections: [
    {
      ...SECTION_META[0],
      title: '¿Qué es el Autismo?',
      body: 'El Trastorno del Espectro Autista (TEA) es una condición neurológica y del desarrollo que afecta cómo una persona se comunica, interactúa, aprende y se comporta.\n\nSe llama "espectro" porque se manifiesta de manera diferente en cada persona — algunas personas autistas necesitan apoyo diario significativo, mientras que otras viven de manera completamente independiente. No existe un único "tipo" de autismo.\n\nEl autismo no es causado por la crianza, las vacunas ni la dieta. La investigación apunta a una combinación de factores genéticos y ambientales que influyen en el desarrollo del cerebro.\n\nLo más importante: el autismo es una diferencia, no un defecto. Las personas autistas experimentan el mundo de una manera única y válida.',
      source: 'Fuente: CDC, NIMH',
    },
    {
      ...SECTION_META[1],
      title: 'Señales tempranas por edad',
      subsections: [
        { label: 'A los 12 meses', items: ['No responde a su nombre', 'Sin balbuceo ni arrullos', 'Sin gestos de ida y vuelta (saludar, señalar, alcanzar)', 'Poco o ningún contacto visual'] },
        { label: 'A los 18 meses', items: ['No dice palabras sueltas', 'No señala para mostrar interés', 'No imita las acciones de otros', 'Pérdida del habla o habilidades que antes tenía'] },
        { label: 'A los 24 meses', items: ['Sin frases de dos palabras con significado', 'No nota a otros niños ni participa en el juego', 'Juego imaginario muy limitado', 'Apego inusual a objetos específicos'] },
        { label: 'Cualquier edad — señales adicionales', items: ['Evita el contacto visual o físico', 'Prefiere jugar solo', 'Repite palabras o frases (ecolalia)', 'Se molesta mucho ante pequeños cambios en la rutina', 'Movimientos repetitivos: aleteo de manos, balanceo, giros', 'Interés intenso y focalizado en temas específicos', 'Hipersensibilidad o hiposensibilidad a sonidos, luces, texturas u olores'] },
      ],
      note: 'Estas señales por sí solas no confirman el autismo. Siempre se necesita una evaluación formal por un especialista. La identificación temprana — incluso antes de los 2 años — lleva a los mejores resultados.',
      source: 'Fuente: CDC, Academia Americana de Pediatría (AAP)',
    },
    {
      ...SECTION_META[2],
      title: 'Diferencias en comunicación y socialización',
      items: ['Dificultad para iniciar o mantener conversaciones', 'Dificultad para entender chistes, sarcasmo o lenguaje figurado', 'Puede que no use gestos para comunicarse (señalar, saludar)', 'Diferencias en el tono, ritmo o volumen del habla', 'Dificultad para comprender las emociones o perspectiva de otros', 'Puede preferir la comunicación escrita o visual sobre la oral', 'Algunos niños autistas no hablan o hablan muy poco — esto no refleja su inteligencia'],
      body: 'Las herramientas de CAA (Comunicación Aumentativa y Alternativa) — como tableros de imágenes, dispositivos generadores de voz y apps como Huda — se usan ampliamente para apoyar a personas autistas que se comunican de manera diferente.',
      source: 'Fuente: ASHA, CDC',
    },
    {
      ...SECTION_META[3],
      title: 'Diferencias sensoriales',
      body: 'Muchas personas autistas procesan la información sensorial de manera diferente a las personas neurotípicas. Esto a veces se llama diferencias en el procesamiento sensorial.\n\nPueden ser hipersensibles (sobrereactivos) o hiposensibles (subreactivos) a:',
      items: ['Sonido — ciertos ruidos se sienten dolorosamente fuertes o imposibles de filtrar', 'Tacto — texturas de ropa, abrazos o roces leves pueden abrumar', 'Luz — las luces brillantes o parpadeantes causan malestar o angustia', 'Gusto y olfato — reacciones intensas ante ciertos alimentos u olores', 'Movimiento — buscar o evitar girar, columpiarse o la presión'],
      body2: 'La sobrecarga sensorial es real y puede ser agotadora. Lo que parece un arrebato conductual a menudo es una respuesta sensorial. Crear un entorno sensorial tranquilo y predecible — como lo intentan los Juegos Sensoriales de Huda — puede marcar una diferencia significativa.',
      source: 'Fuente: Autism Speaks, STAR Institute',
    },
    {
      ...SECTION_META[4],
      title: 'Fortalezas y habilidades',
      body: 'El autismo trae fortalezas genuinas. Aunque cada persona autista es diferente, estas son las más comúnmente reportadas:',
      items: ['Memoria excepcional, especialmente para hechos y detalles', 'Profunda experiencia y pasión en áreas de interés', 'Fuerte reconocimiento de patrones y pensamiento lógico', 'Comunicación honesta y directa — sin agenda oculta', 'Atención al detalle que otros pasan por alto', 'Pensamiento creativo y original', 'Lealtad y profundo compromiso con las personas de confianza', 'Capacidad de concentrarse intensamente en tareas que les importan'],
      body2: 'La investigación reconoce cada vez más las fortalezas autistas como activos en campos como la tecnología, la ciencia, las artes y las matemáticas. La neurodiversidad es una fortaleza para la sociedad en su conjunto.',
      source: 'Fuente: Autistica, Frontiers in Psychiatry (2023)',
    },
    {
      ...SECTION_META[5],
      title: 'Cuándo y cómo buscar ayuda',
      body: 'Si notas alguna señal de autismo en tu hijo — a cualquier edad — habla con un pediatra. Confía en tus instintos. El apoyo temprano hace la mayor diferencia.\n\nLa AAP recomienda el tamizaje en:',
      items: ['9 meses — tamizaje general del desarrollo', '18 meses — tamizaje específico del autismo', '24 meses — tamizaje específico del autismo', 'Cualquier momento en que surja una preocupación'],
      body2: 'Los servicios de intervención temprana — terapia del habla, terapia ocupacional, ABA y apoyo de CAA — han demostrado mejorar significativamente la comunicación, la independencia y la calidad de vida.\n\nUn diagnóstico no es un techo. Es una puerta al apoyo adecuado.',
      source: 'Fuente: AAP, CDC',
    },
  ],
};

// ── French ────────────────────────────────────────────────────────────────────
const FR: AutismPageContent = {
  screenTitle: "Comprendre l'Autisme",
  banner: "Chaque personne autiste est unique. Ce guide est un point de départ, pas une liste de contrôle. Travaillez toujours avec des professionnels qualifiés pour le diagnostic et le soutien.",
  footer: "Informations compilées à partir des CDC, NIMH, AAP, Autistica, ASHA, Autism Speaks et de recherches évaluées par des pairs. Pour des conseils médicaux, consultez un professionnel de santé qualifié.",
  sections: [
    {
      ...SECTION_META[0],
      title: "Qu'est-ce que l'autisme ?",
      body: "Le Trouble du Spectre Autistique (TSA) est une condition neurologique et développementale qui affecte la façon dont une personne communique, interagit, apprend et se comporte.\n\nOn l'appelle « spectre » parce qu'il se manifeste différemment chez chaque personne — certaines personnes autistes ont besoin d'un soutien quotidien important, tandis que d'autres vivent de façon totalement autonome. Il n'existe pas de « type » unique d'autisme.\n\nL'autisme n'est pas causé par l'éducation, les vaccins ou l'alimentation. La recherche indique une combinaison de facteurs génétiques et environnementaux qui influencent le développement du cerveau.\n\nLe plus important : l'autisme est une différence, pas un défaut. Les personnes autistes vivent le monde d'une façon unique et valide.",
      source: 'Source : CDC, NIMH',
    },
    {
      ...SECTION_META[1],
      title: 'Signes précoces par âge',
      subsections: [
        { label: 'À 12 mois', items: ["Ne répond pas à son prénom", "Pas de babillage ni de gazouillis", "Pas de gestes d'interaction (agiter la main, pointer, tendre les bras)", "Peu ou pas de contact visuel"] },
        { label: 'À 18 mois', items: ["Aucun mot isolé", "Ne pointe pas pour montrer un intérêt", "N'imite pas les actions des autres", "Perte du langage ou de compétences précédemment acquises"] },
        { label: 'À 24 mois', items: ["Pas de phrases de deux mots significatives", "Ne remarque pas les autres enfants et ne joue pas avec eux", "Jeu symbolique très limité", "Attachement inhabituel à des objets spécifiques"] },
        { label: 'Tout âge — signes supplémentaires', items: ["Évite le contact visuel ou physique", "Préfère jouer seul", "Répète des mots ou des phrases (écholalie)", "Très bouleversé par de petits changements de routine", "Mouvements répétitifs : battement des mains, balancement, rotation", "Intérêt intense et focalisé sur des sujets spécifiques", "Hypersensibilité ou hyposensibilité aux sons, lumières, textures ou odeurs"] },
      ],
      note: "Ces signes ne confirment pas l'autisme à eux seuls. Une évaluation formelle par un spécialiste est toujours nécessaire. L'identification précoce — même avant 2 ans — conduit aux meilleurs résultats.",
      source: "Source : CDC, Académie Américaine de Pédiatrie (AAP)",
    },
    {
      ...SECTION_META[2],
      title: 'Différences de communication et de socialisation',
      items: ["Difficulté à initier ou maintenir des conversations", "Difficulté à comprendre les blagues, le sarcasme ou le langage figuré", "Peut ne pas utiliser de gestes pour communiquer (pointer, saluer)", "Différences dans le ton, le rythme ou le volume de la parole", "Difficultés à comprendre les émotions ou la perspective des autres", "Peut préférer la communication écrite ou visuelle à la parole", "Certains enfants autistes ne parlent pas ou très peu — cela ne reflète pas leur intelligence"],
      body: "Les outils de CAA (Communication Augmentative et Alternative) — comme les tableaux d'images, les appareils de génération de parole et des applications comme Huda — sont largement utilisés pour soutenir les personnes autistes qui communiquent différemment.",
      source: 'Source : ASHA, CDC',
    },
    {
      ...SECTION_META[3],
      title: 'Différences sensorielles',
      body: "De nombreuses personnes autistes traitent les informations sensorielles différemment des personnes neurotypiques. C'est parfois appelé différences de traitement sensoriel.\n\nElles peuvent être hypersensibles (sur-réactives) ou hyposensibles (sous-réactives) à :",
      items: ["Son — certains bruits semblent douloureusement forts ou impossibles à filtrer", "Toucher — les textures des vêtements, les câlins ou les effleurements peuvent être accablants", "Lumière — les lumières vives ou clignotantes causent de l'inconfort ou de la détresse", "Goût & odorat — réactions fortes à certains aliments ou odeurs", "Mouvement — chercher ou éviter de tourner, se balancer ou la pression"],
      body2: "La surcharge sensorielle est réelle et peut être épuisante. Ce qui ressemble à une crise comportementale est souvent une réponse sensorielle. Créer un environnement sensoriel calme et prévisible — comme le font les Jeux Sensoriels de Huda — peut faire une différence significative.",
      source: 'Source : Autism Speaks, STAR Institute',
    },
    {
      ...SECTION_META[4],
      title: 'Forces et capacités',
      body: "L'autisme apporte de vraies forces. Bien que chaque personne autiste soit différente, voici celles qui sont le plus souvent rapportées :",
      items: ["Mémoire exceptionnelle, surtout pour les faits et les détails", "Expertise profonde et passion dans les domaines d'intérêt", "Forte reconnaissance de schémas et pensée logique", "Communication honnête et directe — sans agenda caché", "Attention aux détails que les autres manquent", "Pensée créative et originale", "Loyauté et engagement profond envers les personnes de confiance", "Capacité de se concentrer intensément sur les tâches qui les intéressent"],
      body2: "La recherche reconnaît de plus en plus les forces autistes comme des atouts dans des domaines comme la technologie, les sciences, les arts et les mathématiques. La neurodiversité est une force pour la société dans son ensemble.",
      source: 'Source : Autistica, Frontiers in Psychiatry (2023)',
    },
    {
      ...SECTION_META[5],
      title: 'Quand et comment chercher de l\'aide',
      body: "Si vous remarquez des signes d'autisme chez votre enfant — à tout âge — parlez à un pédiatre. Faites confiance à vos instincts. Le soutien précoce fait la plus grande différence.\n\nLe dépistage est recommandé par l'AAP à :",
      items: ['9 mois — dépistage général du développement', "18 mois — dépistage spécifique de l'autisme", "24 mois — dépistage spécifique de l'autisme", "À tout moment où une inquiétude se présente"],
      body2: "Les services d'intervention précoce — orthophonie, ergothérapie, ABA et soutien CAA — ont démontré qu'ils améliorent significativement la communication, l'autonomie et la qualité de vie.\n\nUn diagnostic n'est pas un plafond. C'est une porte vers le bon soutien.",
      source: 'Source : AAP, CDC',
    },
  ],
};

// ── Arabic ────────────────────────────────────────────────────────────────────
const AR: AutismPageContent = {
  screenTitle: 'فهم التوحد',
  banner: 'كل شخص مصاب بالتوحد فريد من نوعه. هذا الدليل نقطة بداية وليس قائمة مراجعة. اعمل دائمًا مع متخصصين مؤهلين للتشخيص والدعم.',
  footer: 'معلومات مجمّعة من CDC وNIMH وAAP وAutistica وASHA وAutism Speaks وأبحاث محكّمة. للحصول على مشورة طبية، استشر مزودًا مؤهلًا للرعاية الصحية.',
  sections: [
    {
      ...SECTION_META[0],
      title: 'ما هو التوحد؟',
      body: 'اضطراب طيف التوحد (ASD) هو حالة عصبية ونمائية تؤثر على كيفية تواصل الشخص وتفاعله وتعلّمه وسلوكه.\n\nيُسمّى "طيفًا" لأنه يبدو مختلفًا في كل شخص — بعض الأشخاص المصابين بالتوحد يحتاجون إلى دعم يومي كبير، بينما يعيش آخرون باستقلالية تامة. لا يوجد "نوع" واحد للتوحد.\n\nالتوحد لا يسببه الأبوان، ولا اللقاحات، ولا النظام الغذائي. تشير الأبحاث إلى مزيج من العوامل الجينية والبيئية التي تؤثر في تطور الدماغ.\n\nالأهم من كل شيء: التوحد اختلاف وليس عيبًا. يعيش الأشخاص المصابون بالتوحد العالم بطريقة فريدة وصالحة.',
      source: 'المصدر: CDC، NIMH',
    },
    {
      ...SECTION_META[1],
      title: 'العلامات المبكرة حسب العمر',
      subsections: [
        { label: 'عند عمر 12 شهرًا', items: ['لا يستجيب لاسمه', 'لا ثرثرة أو أصوات', 'لا إيماءات تبادلية (التلويح، الإشارة، المد)', 'تواصل بصري ضعيف أو منعدم'] },
        { label: 'عند عمر 18 شهرًا', items: ['لا ينطق بكلمات مفردة', 'لا يشير للتعبير عن الاهتمام', 'لا يقلد أفعال الآخرين', 'فقدان الكلام أو مهارات كان يمتلكها سابقًا'] },
        { label: 'عند عمر 24 شهرًا', items: ['لا عبارات مكونة من كلمتين ذات معنى', 'لا يلاحظ الأطفال الآخرين ولا ينضم إليهم في اللعب', 'لعب تخيلي محدود جدًا', 'تعلق غير عادي بأشياء معينة'] },
        { label: 'في أي عمر — علامات إضافية', items: ['تجنب التواصل البصري أو اللمسي', 'يفضل اللعب وحده', 'يكرر الكلمات أو العبارات (صدى الكلام)', 'ينزعج بشدة من التغييرات الصغيرة في الروتين', 'حركات متكررة: رفرفة اليدين، التأرجح، الدوران', 'اهتمام مركّز وشديد بمواضيع معينة', 'حساسية مفرطة أو ضعيفة للأصوات والأضواء والملمس والروائح'] },
      ],
      note: 'هذه العلامات وحدها لا تؤكد التوحد. التقييم الرسمي من قِبل متخصص ضروري دائمًا. التعرف المبكر — حتى قبل سن الثانية — يؤدي إلى أفضل النتائج.',
      source: 'المصدر: CDC، الأكاديمية الأمريكية لطب الأطفال (AAP)',
    },
    {
      ...SECTION_META[2],
      title: 'الاختلافات في التواصل والتفاعل الاجتماعي',
      items: ['صعوبة في بدء المحادثات أو الحفاظ عليها', 'صعوبة في فهم النكات والسخرية واللغة المجازية', 'قد لا يستخدم الإيماءات للتواصل (الإشارة، التلويح)', 'اختلافات في نبرة الكلام أو إيقاعه أو حجمه', 'صعوبة في فهم مشاعر الآخرين أو وجهة نظرهم', 'قد يفضل التواصل الكتابي أو البصري على الكلام', 'بعض الأطفال المصابين بالتوحد لا يتكلمون أو يتكلمون بشكل محدود — هذا لا يعكس ذكاءهم'],
      body: 'أدوات التواصل المعزز والبديل (AAC) — مثل لوحات الصور وأجهزة توليد الكلام وتطبيقات مثل هدى — تُستخدم على نطاق واسع لدعم الأشخاص المصابين بالتوحد الذين يتواصلون بطريقة مختلفة.',
      source: 'المصدر: ASHA، CDC',
    },
    {
      ...SECTION_META[3],
      title: 'الاختلافات الحسية',
      body: 'يعالج كثير من الأشخاص المصابين بالتوحد المعلومات الحسية بشكل مختلف عن الأشخاص العصبيين النموذجيين. يُعرف هذا أحيانًا باضطرابات المعالجة الحسية.\n\nقد يكونون مفرطي الحساسية (استجابة زائدة) أو ضعيفي الحساسية (استجابة ضعيفة) لـ:',
      items: ['الصوت — بعض الأصوات تبدو مؤلمة بشكل لا يُحتمل', 'اللمس — ملمس الملابس أو الأحضان أو اللمس الخفيف قد يكون ساحقًا', 'الضوء — الأضواء الساطعة أو الوامضة تسبب الانزعاج', 'الطعم والشم — ردود فعل قوية تجاه أطعمة أو روائح معينة', 'الحركة — البحث عن الدوران أو التأرجح أو الضغط أو تجنبها'],
      body2: 'الإفراط الحسي حقيقي ومرهق. ما يبدو انفجارًا سلوكيًا غالبًا ما يكون استجابة حسية. إنشاء بيئة حسية هادئة ويمكن التنبؤ بها — كما تهدف ألعاب هدى الحسية — يمكن أن يحدث فرقًا كبيرًا.',
      source: 'المصدر: Autism Speaks، STAR Institute',
    },
    {
      ...SECTION_META[4],
      title: 'نقاط القوة والقدرات',
      body: 'يجلب التوحد نقاط قوة حقيقية. وإن كان كل شخص مصاب بالتوحد مختلفًا، فهذه هي الأكثر شيوعًا في التقارير:',
      items: ['ذاكرة استثنائية، خاصة للحقائق والتفاصيل', 'خبرة عميقة وشغف في مجالات الاهتمام', 'قدرة قوية على التعرف على الأنماط والتفكير المنطقي', 'تواصل صادق ومباشر — بلا أجندة خفية', 'انتباه للتفاصيل التي يفوّتها الآخرون', 'تفكير إبداعي وأصيل', 'ولاء والتزام عميق مع الأشخاص الموثوق بهم', 'القدرة على التركيز بشكل مكثف على المهام التي يهتمون بها'],
      body2: 'تُقرّ الأبحاث بشكل متزايد بنقاط القوة لدى الأشخاص المصابين بالتوحد كميزات في مجالات مثل التكنولوجيا والعلوم والفنون والرياضيات. التنوع العصبي قوة للمجتمع بأسره.',
      source: 'المصدر: Autistica، Frontiers in Psychiatry (2023)',
    },
    {
      ...SECTION_META[5],
      title: 'متى وكيف تطلب المساعدة',
      body: 'إذا لاحظت أي علامات للتوحد لدى طفلك — في أي عمر — تحدث إلى طبيب أطفال. ثق بغريزتك. الدعم المبكر يحدث أكبر الفرق.\n\nتوصي AAP بالفحص في:',
      items: ['9 أشهر — فحص نمائي عام', '18 شهرًا — فحص خاص بالتوحد', '24 شهرًا — فحص خاص بالتوحد', 'في أي وقت تنشأ فيه مخاوف'],
      body2: 'خدمات التدخل المبكر — علاج النطق والتخاطب، والعلاج الوظيفي، وتحليل السلوك التطبيقي، ودعم AAC — أثبتت تحسينًا ملحوظًا في التواصل والاستقلالية وجودة الحياة.\n\nالتشخيص ليس سقفًا. إنه باب نحو الدعم المناسب.',
      source: 'المصدر: AAP، CDC',
    },
  ],
};

// ── German ────────────────────────────────────────────────────────────────────
const DE: AutismPageContent = {
  screenTitle: 'Autismus verstehen',
  banner: 'Jeder autistische Mensch ist einzigartig. Dieser Leitfaden ist ein Ausgangspunkt – keine Checkliste. Arbeiten Sie immer mit qualifizierten Fachleuten für Diagnose und Unterstützung zusammen.',
  footer: 'Informationen aus den CDC, NIMH, AAP, Autistica, ASHA, Autism Speaks und begutachteten Forschungsarbeiten. Für medizinische Ratschläge konsultieren Sie eine qualifizierte Gesundheitsfachkraft.',
  sections: [
    {
      ...SECTION_META[0],
      title: 'Was ist Autismus?',
      body: 'Die Autismus-Spektrum-Störung (ASS) ist eine neurologische und entwicklungsbezogene Erkrankung, die beeinflusst, wie eine Person kommuniziert, interagiert, lernt und sich verhält.\n\nSie wird als „Spektrum" bezeichnet, weil sie bei jeder Person anders aussieht — manche autistischen Menschen benötigen erhebliche tägliche Unterstützung, während andere vollkommen selbständig leben. Es gibt keinen einzigen „Typ" von Autismus.\n\nAutismus wird nicht durch Erziehung, Impfstoffe oder Ernährung verursacht. Die Forschung weist auf eine Kombination genetischer und umweltbedingter Faktoren hin, die die Gehirnentwicklung beeinflussen.\n\nAm wichtigsten: Autismus ist eine Andersartigkeit, kein Defekt. Autistische Menschen erleben die Welt auf einzigartige und gültige Weise.',
      source: 'Quelle: CDC, NIMH',
    },
    {
      ...SECTION_META[1],
      title: 'Frühe Zeichen nach Alter',
      subsections: [
        { label: 'Mit 12 Monaten', items: ['Reagiert nicht auf seinen Namen', 'Kein Plappern oder Gurren', 'Keine wechselseitigen Gesten (Winken, Zeigen, Strecken)', 'Wenig oder kein Augenkontakt'] },
        { label: 'Mit 18 Monaten', items: ['Keine einzelnen Wörter gesprochen', 'Zeigt nicht, um Interesse zu zeigen', 'Ahmt die Handlungen anderer nicht nach', 'Verlust von Sprache oder früher vorhandenen Fähigkeiten'] },
        { label: 'Mit 24 Monaten', items: ['Keine sinnvollen Zwei-Wort-Sätze', 'Bemerkt andere Kinder nicht und spielt nicht mit ihnen', 'Sehr eingeschränktes Fantasiespiel', 'Ungewöhnliche Bindung an bestimmte Gegenstände'] },
        { label: 'Jedes Alter — zusätzliche Zeichen', items: ['Vermeidet Augenkontakt oder körperliche Berührung', 'Spielt lieber alleine', 'Wiederholt Wörter oder Sätze (Echolalie)', 'Reagiert bei kleinen Routineänderungen sehr aufgewühlt', 'Sich wiederholende Bewegungen: Händewedeln, Schaukeln, Drehen', 'Intensives, fokussiertes Interesse an bestimmten Themen', 'Über- oder Unterempfindlichkeit gegenüber Geräuschen, Lichtern, Texturen oder Gerüchen'] },
      ],
      note: 'Diese Zeichen bestätigen Autismus nicht allein. Eine formale Bewertung durch einen Spezialisten ist immer erforderlich. Eine frühe Identifikation — noch vor dem 2. Lebensjahr — führt zu den besten Ergebnissen.',
      source: 'Quelle: CDC, Amerikanische Akademie für Pädiatrie (AAP)',
    },
    {
      ...SECTION_META[2],
      title: 'Kommunikations- & Sozialunterschiede',
      items: ['Schwierigkeiten, Gespräche zu beginnen oder aufrechtzuerhalten', 'Schwierigkeiten beim Verstehen von Witzen, Sarkasmus oder bildlicher Sprache', 'Verwendet möglicherweise keine Gesten zur Kommunikation', 'Unterschiede im Ton, Rhythmus oder Volumen der Sprache', 'Schwierigkeiten beim Verstehen der Gefühle oder Perspektive anderer', 'Bevorzugt möglicherweise schriftliche oder visuelle Kommunikation', 'Manche autistischen Kinder sprechen nicht oder kaum — das spiegelt nicht ihre Intelligenz wider'],
      body: 'AAC-Tools (Unterstützte und Alternative Kommunikation) — wie Bilderboards, spracherzeugende Geräte und Apps wie Huda — werden häufig eingesetzt, um autistischen Menschen zu helfen, die anders kommunizieren.',
      source: 'Quelle: ASHA, CDC',
    },
    {
      ...SECTION_META[3],
      title: 'Sensorische Unterschiede',
      body: 'Viele autistische Menschen verarbeiten sensorische Informationen anders als neurotypische Menschen. Dies wird manchmal als sensorische Verarbeitungsunterschiede bezeichnet.\n\nSie können hypersensibel (überreaktiv) oder hyposensibel (unterreaktiv) sein gegenüber:',
      items: ['Geräusch — bestimmte Geräusche fühlen sich schmerzhaft laut an oder sind unmöglich zu filtern', 'Berührung — Kleidungstexturen, Umarmungen oder leichte Berührungen können überwältigend sein', 'Licht — helle oder flackernde Lichter verursachen Unbehagen oder Belastung', 'Geschmack & Geruch — starke Reaktionen auf bestimmte Lebensmittel oder Gerüche', 'Bewegung — Suche nach oder Vermeidung von Drehen, Schaukeln oder Druck'],
      body2: 'Sensorische Überladung ist real und kann erschöpfend sein. Was wie ein Verhaltensausbruch aussieht, ist oft eine sensorische Reaktion. Eine ruhige, vorhersehbare sensorische Umgebung zu schaffen — wie Hudas Sensorische Spiele es anstreben — kann einen bedeutenden Unterschied machen.',
      source: 'Quelle: Autism Speaks, STAR Institute',
    },
    {
      ...SECTION_META[4],
      title: 'Stärken & Fähigkeiten',
      body: 'Autismus bringt echte Stärken mit sich. Obwohl jeder autistische Mensch anders ist, werden diese am häufigsten berichtet:',
      items: ['Außergewöhnliches Gedächtnis, besonders für Fakten und Details', 'Tiefes Fachwissen und Leidenschaft in Interessengebieten', 'Starke Mustererkennung und logisches Denken', 'Ehrliche, direkte Kommunikation — ohne versteckte Agenda', 'Aufmerksamkeit für Details, die andere übersehen', 'Kreatives und originelles Denken', 'Loyalität und tiefes Engagement gegenüber vertrauten Menschen', 'Fähigkeit, sich intensiv auf Aufgaben zu konzentrieren, die ihnen wichtig sind'],
      body2: 'Die Forschung erkennt autistische Stärken zunehmend als Vorteile in Bereichen wie Technologie, Wissenschaft, Kunst und Mathematik an. Neurodiversität ist eine Stärke für die Gesellschaft als Ganzes.',
      source: 'Quelle: Autistica, Frontiers in Psychiatry (2023)',
    },
    {
      ...SECTION_META[5],
      title: 'Wann & wie Hilfe suchen',
      body: 'Wenn Sie bei Ihrem Kind Anzeichen von Autismus bemerken — in jedem Alter — sprechen Sie mit einem Kinderarzt. Vertrauen Sie Ihrem Instinkt. Frühe Unterstützung macht den größten Unterschied.\n\nDas AAP empfiehlt Screening bei:',
      items: ['9 Monate — allgemeines Entwicklungs-Screening', '18 Monate — autismusspezifisches Screening', '24 Monate — autismusspezifisches Screening', 'Jederzeit, wenn eine Sorge auftritt'],
      body2: 'Frühinterventionsdienste — Sprachtherapie, Ergotherapie, ABA und AAC-Unterstützung — haben sich nachweislich positiv auf Kommunikation, Selbständigkeit und Lebensqualität ausgewirkt.\n\nEine Diagnose ist keine Decke. Sie ist eine Tür zur richtigen Unterstützung.',
      source: 'Quelle: AAP, CDC',
    },
  ],
};

// ── Portuguese ────────────────────────────────────────────────────────────────
const PT: AutismPageContent = {
  screenTitle: 'Entendendo o Autismo',
  banner: 'Cada pessoa autista é única. Este guia é um ponto de partida, não uma lista de verificação. Sempre trabalhe com profissionais qualificados para diagnóstico e suporte.',
  footer: 'Informações compiladas do CDC, NIMH, AAP, Autistica, ASHA, Autism Speaks e pesquisas revisadas por pares. Para aconselhamento médico, consulte um profissional de saúde qualificado.',
  sections: [
    {
      ...SECTION_META[0],
      title: 'O que é o Autismo?',
      body: 'O Transtorno do Espectro Autista (TEA) é uma condição neurológica e do desenvolvimento que afeta como uma pessoa se comunica, interage, aprende e se comporta.\n\nChama-se "espectro" porque se manifesta de forma diferente em cada pessoa — alguns autistas precisam de suporte diário significativo, enquanto outros vivem de forma totalmente independente. Não existe um único "tipo" de autismo.\n\nO autismo não é causado pela criação, vacinas ou dieta. A pesquisa aponta para uma combinação de fatores genéticos e ambientais que influenciam o desenvolvimento cerebral.\n\nO mais importante: o autismo é uma diferença, não um defeito. Pessoas autistas experimentam o mundo de uma forma única e válida.',
      source: 'Fonte: CDC, NIMH',
    },
    {
      ...SECTION_META[1],
      title: 'Sinais precoces por idade',
      subsections: [
        { label: 'Aos 12 meses', items: ['Não responde ao próprio nome', 'Sem balbucio ou gorjeio', 'Sem gestos de ida e volta (acenar, apontar, alcançar)', 'Pouco ou nenhum contato visual'] },
        { label: 'Aos 18 meses', items: ['Nenhuma palavra isolada falada', 'Não aponta para mostrar interesse', 'Não imita as ações dos outros', 'Perda de fala ou habilidades que tinha anteriormente'] },
        { label: 'Aos 24 meses', items: ['Sem frases de duas palavras com significado', 'Não percebe outras crianças ou se junta ao brincar', 'Brincadeira de faz-de-conta muito limitada', 'Apego incomum a objetos específicos'] },
        { label: 'Qualquer idade — sinais adicionais', items: ['Evita contato visual ou físico', 'Prefere brincar sozinho', 'Repete palavras ou frases (ecolalia)', 'Fica muito perturbado por pequenas mudanças na rotina', 'Movimentos repetitivos: agitar as mãos, balançar, girar', 'Interesse intenso e focado em tópicos específicos', 'Hipersensibilidade ou hipossensibilidade a sons, luzes, texturas ou cheiros'] },
      ],
      note: 'Esses sinais por si só não confirmam o autismo. Uma avaliação formal por um especialista é sempre necessária. A identificação precoce — mesmo antes dos 2 anos — leva aos melhores resultados.',
      source: 'Fonte: CDC, Academia Americana de Pediatria (AAP)',
    },
    {
      ...SECTION_META[2],
      title: 'Diferenças de comunicação e socialização',
      items: ['Dificuldade em iniciar ou manter conversas', 'Dificuldade em entender piadas, sarcasmo ou linguagem figurada', 'Pode não usar gestos para se comunicar (apontar, acenar)', 'Diferenças no tom, ritmo ou volume da fala', 'Dificuldades em entender as emoções ou perspectiva dos outros', 'Pode preferir comunicação escrita ou visual à falada', 'Algumas crianças autistas não falam ou falam muito pouco — isso não reflete inteligência'],
      body: 'Ferramentas de CAA (Comunicação Aumentativa e Alternativa) — como quadros de imagens, dispositivos geradores de fala e apps como o Huda — são amplamente usados para apoiar autistas que se comunicam de forma diferente.',
      source: 'Fonte: ASHA, CDC',
    },
    {
      ...SECTION_META[3],
      title: 'Diferenças sensoriais',
      body: 'Muitos autistas processam informações sensoriais de forma diferente das pessoas neurotípicas. Isso às vezes é chamado de diferenças de processamento sensorial.\n\nPodem ser hipersensíveis (sobre-responsivos) ou hiposensíveis (sub-responsivos) a:',
      items: ['Som — certos ruídos parecem dolorosamente altos ou impossíveis de filtrar', 'Toque — texturas de roupas, abraços ou toques leves podem ser avassaladores', 'Luz — luzes brilhantes ou piscantes causam desconforto ou angústia', 'Gosto & cheiro — reações fortes a certos alimentos ou odores', 'Movimento — buscar ou evitar girar, balançar ou pressão'],
      body2: 'A sobrecarga sensorial é real e pode ser exaustiva. O que parece uma crise comportamental muitas vezes é uma resposta sensorial. Criar um ambiente sensorial calmo e previsível — como os Jogos Sensoriais do Huda buscam fazer — pode fazer uma diferença significativa.',
      source: 'Fonte: Autism Speaks, STAR Institute',
    },
    {
      ...SECTION_META[4],
      title: 'Pontos fortes e habilidades',
      body: 'O autismo traz pontos fortes genuínos. Embora cada autista seja diferente, estes são os mais relatados:',
      items: ['Memória excepcional, especialmente para fatos e detalhes', 'Profundo conhecimento e paixão em áreas de interesse', 'Forte reconhecimento de padrões e pensamento lógico', 'Comunicação honesta e direta — sem agenda oculta', 'Atenção a detalhes que outros perdem', 'Pensamento criativo e original', 'Lealdade e profundo comprometimento com pessoas de confiança', 'Capacidade de se concentrar intensamente em tarefas que lhes importam'],
      body2: 'A pesquisa reconhece cada vez mais os pontos fortes autistas como ativos em áreas como tecnologia, ciência, artes e matemática. A neurodiversidade é uma força para a sociedade como um todo.',
      source: 'Fonte: Autistica, Frontiers in Psychiatry (2023)',
    },
    {
      ...SECTION_META[5],
      title: 'Quando e como buscar ajuda',
      body: 'Se você notar sinais de autismo em seu filho — em qualquer idade — fale com um pediatra. Confie nos seus instintos. O suporte precoce faz a maior diferença.\n\nO AAP recomenda triagem em:',
      items: ['9 meses — triagem geral do desenvolvimento', '18 meses — triagem específica do autismo', '24 meses — triagem específica do autismo', 'Qualquer momento em que surgir uma preocupação'],
      body2: 'Serviços de intervenção precoce — fonoaudiologia, terapia ocupacional, ABA e suporte de CAA — comprovadamente melhoram significativamente a comunicação, a independência e a qualidade de vida.\n\nUm diagnóstico não é um teto. É uma porta para o apoio certo.',
      source: 'Fonte: AAP, CDC',
    },
  ],
};

// ── Chinese ───────────────────────────────────────────────────────────────────
const ZH: AutismPageContent = {
  screenTitle: '了解自闭症',
  banner: '每个自闭症人士都是独一无二的。本指南是一个起点，不是核对清单。诊断和支持请始终与合格的专业人士合作。',
  footer: '信息来源：CDC、NIMH、AAP、Autistica、ASHA、Autism Speaks及同行评审研究。医疗建议请咨询合格的医疗专业人员。',
  sections: [
    {
      ...SECTION_META[0],
      title: '什么是自闭症？',
      body: '自闭症谱系障碍（ASD）是一种神经发育障碍，影响一个人的沟通、互动、学习和行为方式。\n\n它被称为"谱系"，因为它在每个人身上的表现都不同——有些自闭症人士需要大量的日常支持，而另一些人则完全独立生活。没有单一"类型"的自闭症。\n\n自闭症不是由养育方式、疫苗或饮食引起的。研究表明，遗传和环境因素的组合影响大脑的发育。\n\n最重要的是：自闭症是一种差异，不是缺陷。自闭症人士以独特而有效的方式体验世界。',
      source: '来源：CDC、NIMH',
    },
    {
      ...SECTION_META[1],
      title: '按年龄划分的早期迹象',
      subsections: [
        { label: '12个月时', items: ['不回应自己的名字', '没有咿呀学语或咕咕声', '没有互动性手势（挥手、指向、伸手）', '很少或没有眼神接触'] },
        { label: '18个月时', items: ['没有说出单个词语', '不用手指来表达兴趣', '不模仿他人的动作', '失去以前拥有的语言或技能'] },
        { label: '24个月时', items: ['没有有意义的两词短语', '不注意其他孩子或加入玩耍', '象征性游戏非常有限', '对特定物品有异常依恋'] },
        { label: '任何年龄 — 其他迹象', items: ['避免眼神接触或身体接触', '喜欢独自玩耍', '重复单词或短语（仿说）', '对日常小变化感到非常不安', '重复性动作：拍手、摇摆、旋转', '对特定话题有强烈而专注的兴趣', '对声音、灯光、质地或气味过度或不足敏感'] },
      ],
      note: '这些迹象本身并不能确认自闭症。始终需要专科医生进行正式评估。早期识别——即使在2岁之前——能带来最好的结果。',
      source: '来源：CDC、美国儿科学会（AAP）',
    },
    {
      ...SECTION_META[2],
      title: '沟通与社交差异',
      items: ['难以开始或维持对话', '难以理解笑话、讽刺或比喻语言', '可能不使用手势沟通（指向、挥手）', '说话的语调、节奏或音量有所不同', '难以理解他人的情绪或观点', '可能更喜欢书面或视觉沟通而非口头表达', '一些自闭症儿童不说话或说话很少——这并不反映智力水平'],
      body: 'AAC（辅助和替代沟通）工具——如图片板、语音生成设备和Huda等应用——被广泛用于支持以不同方式沟通的自闭症人士。',
      source: '来源：ASHA、CDC',
    },
    {
      ...SECTION_META[3],
      title: '感觉差异',
      body: '许多自闭症人士处理感觉信息的方式与神经典型人士不同。这有时被称为感觉处理差异。\n\n他们可能对以下方面过度敏感（反应过度）或不足敏感（反应不足）：',
      items: ['声音——某些噪音感觉痛苦地响亮或无法过滤', '触感——衣物质地、拥抱或轻触可能让人不堪重负', '光线——明亮或闪烁的灯光引起不适或困扰', '味道和气味——对某些食物或气味有强烈反应', '动作——寻求或回避旋转、摇摆或压力'],
      body2: '感觉超载是真实存在的，会让人精疲力竭。看起来像行为爆发的情况往往是感觉反应。创造一个平静、可预测的感觉环境——正如Huda感觉游戏所努力做到的——可以产生重要的影响。',
      source: '来源：Autism Speaks、STAR Institute',
    },
    {
      ...SECTION_META[4],
      title: '优势与能力',
      body: '自闭症带来了真正的优势。虽然每个自闭症人士都不同，但以下是最常被报告的：',
      items: ['卓越的记忆力，尤其是事实和细节', '在感兴趣领域有深厚的专业知识和热情', '强大的模式识别能力和逻辑思维', '诚实、直接的沟通——没有隐藏议程', '对他人忽视的细节保持关注', '创意和独创性思维', '对信任的人忠诚、深度承诺', '能够对感兴趣的任务高度专注'],
      body2: '研究越来越认识到自闭症优势在技术、科学、艺术和数学等领域是资产。神经多样性是整个社会的力量。',
      source: '来源：Autistica、Frontiers in Psychiatry（2023）',
    },
    {
      ...SECTION_META[5],
      title: '何时及如何寻求帮助',
      body: '如果您注意到孩子有任何自闭症迹象——无论何年龄——请向儿科医生咨询。相信您的直觉。早期支持效果最显著。\n\nAAP推荐在以下时间进行筛查：',
      items: ['9个月——一般发育筛查', '18个月——自闭症专项筛查', '24个月——自闭症专项筛查', '任何出现担忧的时候'],
      body2: '早期干预服务——言语治疗、职业治疗、应用行为分析（ABA）和AAC支持——已被证明可以显著改善沟通、独立性和生活质量。\n\n诊断不是天花板，而是通向正确支持的大门。',
      source: '来源：AAP、CDC',
    },
  ],
};

// ── Hindi ─────────────────────────────────────────────────────────────────────
const HI: AutismPageContent = {
  screenTitle: 'ऑटिज़्म को समझना',
  banner: 'हर ऑटिस्टिक व्यक्ति अनोखा होता है। यह गाइड एक शुरुआती बिंदु है — चेकलिस्ट नहीं। निदान और सहायता के लिए हमेशा योग्य पेशेवरों के साथ काम करें।',
  footer: 'जानकारी CDC, NIMH, AAP, Autistica, ASHA, Autism Speaks और समीक्षित शोध से संकलित। चिकित्सा सलाह के लिए किसी योग्य स्वास्थ्य सेवा प्रदाता से परामर्श करें।',
  sections: [
    {
      ...SECTION_META[0],
      title: 'ऑटिज़्म क्या है?',
      body: 'ऑटिज़्म स्पेक्ट्रम डिसऑर्डर (ASD) एक न्यूरोलॉजिकल और विकासात्मक स्थिति है जो प्रभावित करती है कि व्यक्ति कैसे संवाद करता है, बातचीत करता है, सीखता है और व्यवहार करता है।\n\nइसे "स्पेक्ट्रम" कहा जाता है क्योंकि यह हर व्यक्ति में अलग दिखता है — कुछ ऑटिस्टिक लोगों को महत्वपूर्ण दैनिक सहायता की आवश्यकता होती है, जबकि अन्य पूरी तरह स्वतंत्र रूप से जीते हैं। ऑटिज़्म का कोई एकल "प्रकार" नहीं है।\n\nऑटिज़्म पालन-पोषण, टीके या आहार से नहीं होता। शोध आनुवंशिक और पर्यावरणीय कारकों के संयोजन की ओर इशारा करता है जो मस्तिष्क विकास को प्रभावित करते हैं।\n\nसबसे महत्वपूर्ण: ऑटिज़्म एक अंतर है, कोई दोष नहीं। ऑटिस्टिक लोग दुनिया को एक अनोखे और वैध तरीके से अनुभव करते हैं।',
      source: 'स्रोत: CDC, NIMH',
    },
    {
      ...SECTION_META[1],
      title: 'उम्र के अनुसार शुरुआती संकेत',
      subsections: [
        { label: '12 महीने में', items: ['अपने नाम का जवाब नहीं देता', 'कोई बड़बड़ाना या गुनगुनाना नहीं', 'कोई आदान-प्रदान वाले इशारे नहीं (हाथ हिलाना, इशारा करना, पहुँचना)', 'बहुत कम या कोई आँख संपर्क नहीं'] },
        { label: '18 महीने में', items: ['कोई एकल शब्द नहीं बोला', 'रुचि दिखाने के लिए इशारा नहीं करता', 'दूसरों की क्रियाओं की नकल नहीं करता', 'पहले जो भाषा या कौशल थे उन्हें खोना'] },
        { label: '24 महीने में', items: ['दो शब्दों के सार्थक वाक्य नहीं', 'दूसरे बच्चों को नोटिस नहीं करता या उनके साथ नहीं खेलता', 'कल्पनाशील खेल बहुत सीमित', 'विशेष वस्तुओं से असामान्य लगाव'] },
        { label: 'किसी भी उम्र में — अतिरिक्त संकेत', items: ['आँख संपर्क या शारीरिक स्पर्श से बचना', 'अकेले खेलना पसंद करना', 'शब्दों या वाक्यांशों को दोहराना (इकोलेलिया)', 'दिनचर्या में छोटे बदलावों से बहुत परेशान होना', 'दोहराने वाली हरकतें: हाथ फड़फड़ाना, झूलना, घूमना', 'विशेष विषयों में तीव्र, केंद्रित रुचि', 'आवाज़, रोशनी, बनावट या गंध के प्रति अति- या अल्प-संवेदनशीलता'] },
      ],
      note: 'ये संकेत अकेले ऑटिज़्म की पुष्टि नहीं करते। एक विशेषज्ञ द्वारा औपचारिक मूल्यांकन हमेशा आवश्यक होता है। शुरुआती पहचान — 2 साल की उम्र से पहले भी — सबसे अच्छे परिणाम देती है।',
      source: 'स्रोत: CDC, अमेरिकन एकेडमी ऑफ पीडियाट्रिक्स (AAP)',
    },
    {
      ...SECTION_META[2],
      title: 'संचार और सामाजिक अंतर',
      items: ['बातचीत शुरू करने या बनाए रखने में कठिनाई', 'चुटकुले, व्यंग्य या आलंकारिक भाषा समझने में परेशानी', 'संवाद के लिए इशारों का उपयोग नहीं कर सकते', 'भाषण के स्वर, लय या मात्रा में अंतर', 'दूसरों की भावनाओं या दृष्टिकोण को समझने में कठिनाई', 'बोले जाने की बजाय लिखित या दृश्य संचार पसंद कर सकते हैं', 'कुछ ऑटिस्टिक बच्चे बोलते नहीं या बहुत कम बोलते हैं — यह उनकी बुद्धिमत्ता को नहीं दर्शाता'],
      body: 'AAC (संवर्धित और वैकल्पिक संचार) उपकरण — जैसे चित्र बोर्ड, भाषण उत्पन्न करने वाले उपकरण और हुदा जैसे ऐप — व्यापक रूप से उन ऑटिस्टिक लोगों का समर्थन करने के लिए उपयोग किए जाते हैं जो अलग तरह से संवाद करते हैं।',
      source: 'स्रोत: ASHA, CDC',
    },
    {
      ...SECTION_META[3],
      title: 'संवेदी अंतर',
      body: 'कई ऑटिस्टिक लोग न्यूरोटिपिकल लोगों से अलग तरीके से संवेदी जानकारी संसाधित करते हैं। इसे कभी-कभी संवेदी प्रसंस्करण अंतर कहा जाता है।\n\nवे इनके प्रति अतिसंवेदनशील (अत्यधिक प्रतिक्रिया) या कम संवेदनशील (कम प्रतिक्रिया) हो सकते हैं:',
      items: ['आवाज़ — कुछ आवाज़ें दर्दनाक रूप से ज़ोर से लगती हैं या फ़िल्टर करना असंभव होता है', 'स्पर्श — कपड़ों की बनावट, गले लगाना, या हल्का स्पर्श भारी लग सकता है', 'रोशनी — तेज या टिमटिमाती रोशनी असुविधा या परेशानी पैदा करती है', 'स्वाद और गंध — कुछ खाद्य पदार्थों या सुगंधों पर तीव्र प्रतिक्रिया', 'गति — घूमने, झूलने या दबाव की तलाश करना या उससे बचना'],
      body2: 'संवेदी अधिभार वास्तविक है और थकाऊ हो सकता है। जो व्यवहार संबंधी विस्फोट जैसा दिखता है वह अक्सर एक संवेदी प्रतिक्रिया होती है। एक शांत, अनुमानित संवेदी वातावरण बनाना — जैसा कि हुदा के संवेदी खेल करना चाहते हैं — एक सार्थक अंतर ला सकता है।',
      source: 'स्रोत: Autism Speaks, STAR Institute',
    },
    {
      ...SECTION_META[4],
      title: 'ताकत और क्षमताएँ',
      body: 'ऑटिज़्म वास्तविक ताकत लाता है। हालाँकि हर ऑटिस्टिक व्यक्ति अलग है, ये सामान्यतः रिपोर्ट की जाती हैं:',
      items: ['असाधारण स्मृति, विशेषकर तथ्यों और विवरणों के लिए', 'रुचि के क्षेत्रों में गहरी विशेषज्ञता और जुनून', 'मजबूत पैटर्न पहचान और तार्किक सोच', 'ईमानदार, सीधा संचार — कोई छिपी हुई एजेंडा नहीं', 'उन विवरणों पर ध्यान जो दूसरे चूक जाते हैं', 'रचनात्मक और मौलिक सोच', 'विश्वास करने वाले लोगों के प्रति वफ़ादारी और गहरी प्रतिबद्धता', 'जिन कार्यों की परवाह है उन पर गहन ध्यान केंद्रित करने की क्षमता'],
      body2: 'शोध तेजी से प्रौद्योगिकी, विज्ञान, कला और गणित जैसे क्षेत्रों में ऑटिस्टिक ताकत को संपत्ति के रूप में मान्यता दे रहा है। न्यूरोडाइवर्सिटी पूरे समाज के लिए एक ताकत है।',
      source: 'स्रोत: Autistica, Frontiers in Psychiatry (2023)',
    },
    {
      ...SECTION_META[5],
      title: 'कब और कैसे मदद लें',
      body: 'यदि आप अपने बच्चे में ऑटिज़्म के कोई संकेत देखते हैं — किसी भी उम्र में — एक बाल रोग विशेषज्ञ से बात करें। अपनी प्रवृत्ति पर भरोसा करें। जल्दी समर्थन सबसे बड़ा अंतर बनाता है।\n\nAAP द्वारा स्क्रीनिंग की सिफारिश की जाती है:',
      items: ['9 महीने — सामान्य विकासात्मक स्क्रीनिंग', '18 महीने — ऑटिज़्म-विशिष्ट स्क्रीनिंग', '24 महीने — ऑटिज़्म-विशिष्ट स्क्रीनिंग', 'किसी भी समय जब चिंता हो'],
      body2: 'प्रारंभिक हस्तक्षेप सेवाएँ — स्पीच थेरेपी, ऑक्यूपेशनल थेरेपी, ABA और AAC सहायता — संचार, स्वतंत्रता और जीवन की गुणवत्ता में उल्लेखनीय सुधार करने के लिए सिद्ध हुई हैं।\n\nनिदान कोई छत नहीं है। यह सही सहायता का दरवाज़ा है।',
      source: 'स्रोत: AAP, CDC',
    },
  ],
};

// ── Lookup ────────────────────────────────────────────────────────────────────

const AUTISM_CONTENT: Record<LanguageCode, AutismPageContent> = {
  en: EN,
  es: ES,
  fr: FR,
  ar: AR,
  de: DE,
  pt: PT,
  zh: ZH,
  hi: HI,
};

export function getAutismContent(lang: LanguageCode): AutismPageContent {
  return AUTISM_CONTENT[lang] ?? EN;
}
