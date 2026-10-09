import type { LanguageCode } from '@/data/translations';

export type HowToGuideStep = {
  title: string;
  body: string;
  icon: string;
};

export type HowToGuideSection = {
  title: string;
  icon: string;
  steps: HowToGuideStep[];
};

export type HowToGuideCopy = {
  title: string;
  navSubtitle: string;
  backLabel: string;
  introTitle: string;
  introBody: string;
  sections: HowToGuideSection[];
  languageTitle: string;
  languageInstructions: string;
  languageNames: string[];
  offlineTitle: string;
  offlineBody: string;
};

export const HOW_TO_GUIDE: Record<LanguageCode, HowToGuideCopy> = {
  en: {
    title: 'How to use Huda AAC',
    navSubtitle: 'Quick guide',
    backLabel: 'Back to caregiver menu',
    introTitle: 'Start with one picture',
    introBody: 'Huda AAC is a communication and calming app. Follow the child’s pace; every way of communicating is welcome.',
    sections: [
      {
        title: 'Build a message',
        icon: 'chatbubble-ellipses',
        steps: [
          { title: 'Tap a picture', body: 'Choose a picture tile. Huda AAC adds its word to the message and says the word aloud.', icon: 'chatbubble-ellipses' },
          { title: 'Add more words', body: 'Tap more tiles to build a message. The sentence strip above the boards keeps the words in order.', icon: 'grid-outline' },
          { title: 'Speak or edit the message', body: 'Tap Speak to hear the full message. Use the curved arrow to remove the last word or the bin to clear the message.', icon: 'megaphone' },
        ],
      },
      {
        title: 'Explore the home screen',
        icon: 'grid-outline',
        steps: [
          { title: 'Switch boards', body: 'Scroll the strip below the message to find word groups such as People, Food, Home, School, or Feelings.', icon: 'grid-outline' },
          { title: 'Open quick activities', body: 'The buttons at the top right open Feelings, Sensory Music, and Sensory Games.', icon: 'game-controller-outline' },
          { title: 'Take a quiet moment', body: 'Tap the moon button to enter Quiet Mode. Tap Exit Quiet Mode to return to the communication board.', icon: 'moon-outline' },
        ],
      },
      {
        title: 'Caregiver tools',
        icon: 'settings-outline',
        steps: [
          { title: 'Open Caregiver Mode', body: 'Tap the menu button at the top left. If a caregiver PIN is set, enter it to continue.', icon: 'menu-outline' },
          { title: 'Personalize picture tiles', body: 'An adult can press and hold a tile to change its picture, label, or sound. Open Boards in Caregiver Mode to manage boards and tiles.', icon: 'grid-outline' },
          { title: 'Use Settings and learning resources', body: 'Settings includes language, voice, display, and security options. Therapy Guide contains Huda AAC lessons and reference summaries stored offline; source websites need internet.', icon: 'book-outline' },
          { title: 'Review reports', body: 'Reports shows tile-use information and feelings check-ins.', icon: 'bar-chart-outline' },
        ],
      },
    ],
    languageTitle: 'Change the guide language',
    languageInstructions: 'In Caregiver Mode, open Settings → Language and choose a language below. This guide follows your choice. Spoken words depend on a compatible voice being available on the device.',
    languageNames: ['English', 'Español', 'Français', 'العربية', 'Deutsch', 'Português', '中文', 'हिन्दी'],
    offlineTitle: 'No account needed',
    offlineBody: 'Huda AAC opens without an email, account, or sign-in. This guide and the Therapy Guide lesson materials are stored in the app and can be used offline. Internet is needed to open source websites.',
  },
  es: {
    title: 'Cómo usar Huda AAC',
    navSubtitle: 'Guía rápida',
    backLabel: 'Volver al menú de cuidadores',
    introTitle: 'Empieza con una imagen',
    introBody: 'Huda AAC es una aplicación de comunicación y calma. Sigue el ritmo del niño; cualquier forma de comunicarse es bienvenida.',
    sections: [
      {
        title: 'Crea un mensaje',
        icon: 'chatbubble-ellipses',
        steps: [
          { title: 'Toca una imagen', body: 'Elige una ficha con imagen. Huda AAC añade su palabra al mensaje y la dice en voz alta.', icon: 'chatbubble-ellipses' },
          { title: 'Añade más palabras', body: 'Toca más fichas para crear un mensaje. La franja de frases encima de los tableros muestra las palabras en orden.', icon: 'grid-outline' },
          { title: 'Escucha o edita el mensaje', body: 'Pulsa Speak para escuchar el mensaje completo. Usa la flecha curva para quitar la última palabra o la papelera para borrarlo.', icon: 'megaphone' },
        ],
      },
      {
        title: 'Explora la pantalla principal',
        icon: 'grid-outline',
        steps: [
          { title: 'Cambia de tablero', body: 'Desliza la fila debajo del mensaje para encontrar grupos de palabras como Personas, Comida, Casa, Escuela o Sentimientos.', icon: 'grid-outline' },
          { title: 'Abre actividades rápidas', body: 'Los botones de la parte superior derecha abren Sentimientos, Música sensorial y Juegos sensoriales.', icon: 'game-controller-outline' },
          { title: 'Tómate un momento de calma', body: 'Pulsa la luna para activar el Modo tranquilo. Pulsa Salir del modo tranquilo para volver al tablero de comunicación.', icon: 'moon-outline' },
        ],
      },
      {
        title: 'Herramientas para cuidadores',
        icon: 'settings-outline',
        steps: [
          { title: 'Abre el Modo de cuidadores', body: 'Pulsa el botón de menú de la esquina superior izquierda. Si hay un PIN de cuidador, introdúcelo para continuar.', icon: 'menu-outline' },
          { title: 'Personaliza las fichas', body: 'Un adulto puede mantener pulsada una ficha para cambiar su imagen, etiqueta o sonido. Entra en Tableros dentro del Modo de cuidadores para administrar tableros y fichas.', icon: 'grid-outline' },
          { title: 'Usa los ajustes y recursos de aprendizaje', body: 'Ajustes incluye opciones de idioma, voz, pantalla y seguridad. La Guía de terapia contiene lecciones de Huda AAC y resúmenes de referencias guardados sin conexión; las páginas web de las fuentes requieren internet.', icon: 'book-outline' },
          { title: 'Consulta los informes', body: 'Informes muestra el uso de las fichas y los registros de emociones.', icon: 'bar-chart-outline' },
        ],
      },
    ],
    languageTitle: 'Cambia el idioma de la guía',
    languageInstructions: 'En el Modo de cuidadores, abre Ajustes → Idioma y elige una opción de la lista. La guía seguirá tu elección. La voz depende de que el dispositivo tenga una voz compatible.',
    languageNames: ['Inglés', 'Español', 'Francés', 'Árabe', 'Alemán', 'Portugués', 'Chino', 'Hindi'],
    offlineTitle: 'No necesitas una cuenta',
    offlineBody: 'Huda AAC se abre sin correo electrónico, cuenta ni inicio de sesión. Esta guía y los materiales de la Guía de terapia están guardados en la aplicación y funcionan sin conexión. Necesitas internet para abrir las páginas web de las fuentes.',
  },
  fr: {
    title: 'Comment utiliser Huda AAC',
    navSubtitle: 'Guide rapide',
    backLabel: 'Retour au menu des aidants',
    introTitle: 'Commencez par une image',
    introBody: 'Huda AAC est une application de communication et d’apaisement. Respectez le rythme de l’enfant : toutes les façons de communiquer sont les bienvenues.',
    sections: [
      {
        title: 'Créer un message',
        icon: 'chatbubble-ellipses',
        steps: [
          { title: 'Touchez une image', body: 'Choisissez une case illustrée. Huda AAC ajoute le mot au message et le prononce à voix haute.', icon: 'chatbubble-ellipses' },
          { title: 'Ajoutez d’autres mots', body: 'Touchez d’autres cases pour composer un message. La bande de phrase au-dessus des tableaux affiche les mots dans l’ordre.', icon: 'grid-outline' },
          { title: 'Écoutez ou modifiez le message', body: 'Touchez Speak pour entendre le message entier. La flèche courbe supprime le dernier mot et la corbeille efface le message.', icon: 'megaphone' },
        ],
      },
      {
        title: 'Découvrir l’écran d’accueil',
        icon: 'grid-outline',
        steps: [
          { title: 'Changer de tableau', body: 'Faites défiler la rangée sous le message pour trouver des groupes de mots : personnes, aliments, maison, école ou émotions.', icon: 'grid-outline' },
          { title: 'Ouvrir les activités rapides', body: 'Les boutons en haut à droite ouvrent Émotions, Musique sensorielle et Jeux sensoriels.', icon: 'game-controller-outline' },
          { title: 'Faire une pause au calme', body: 'Touchez la lune pour activer le mode calme. Touchez Quitter le mode calme pour revenir au tableau de communication.', icon: 'moon-outline' },
        ],
      },
      {
        title: 'Outils pour les aidants',
        icon: 'settings-outline',
        steps: [
          { title: 'Ouvrir le mode Aidant', body: 'Touchez le bouton de menu en haut à gauche. Si un code PIN aidant est défini, saisissez-le pour continuer.', icon: 'menu-outline' },
          { title: 'Personnaliser les cases', body: 'Un adulte peut maintenir une case appuyée pour modifier son image, son libellé ou son son. Ouvrez Tableaux dans le mode Aidant pour gérer les tableaux et les cases.', icon: 'grid-outline' },
          { title: 'Utiliser les réglages et les ressources', body: 'Les réglages proposent la langue, la voix, l’affichage et la sécurité. Le Guide des thérapies contient des leçons Huda AAC et des résumés de références enregistrés hors ligne ; les sites sources nécessitent Internet.', icon: 'book-outline' },
          { title: 'Consulter les rapports', body: 'Les rapports présentent l’utilisation des cases et les bilans des émotions.', icon: 'bar-chart-outline' },
        ],
      },
    ],
    languageTitle: 'Changer la langue du guide',
    languageInstructions: 'Dans le mode Aidant, ouvrez Réglages → Langue et choisissez une langue ci-dessous. Le guide suit votre choix. La parole dépend de la disponibilité d’une voix compatible sur l’appareil.',
    languageNames: ['Anglais', 'Espagnol', 'Français', 'Arabe', 'Allemand', 'Portugais', 'Chinois', 'Hindi'],
    offlineTitle: 'Aucun compte nécessaire',
    offlineBody: 'Huda AAC s’ouvre sans adresse e-mail, compte ni connexion. Ce guide et les ressources du Guide des thérapies sont stockés dans l’application et utilisables hors ligne. Une connexion Internet est nécessaire pour ouvrir les sites des sources.',
  },
  ar: {
    title: 'كيفية استخدام Huda AAC',
    navSubtitle: 'دليل سريع',
    backLabel: 'العودة إلى قائمة مقدم الرعاية',
    introTitle: 'ابدأ بصورة واحدة',
    introBody: 'Huda AAC تطبيق للتواصل والهدوء. اتبع وتيرة الطفل؛ فكل طريقة للتواصل مرحّب بها.',
    sections: [
      {
        title: 'كوّن رسالة',
        icon: 'chatbubble-ellipses',
        steps: [
          { title: 'اضغط على صورة', body: 'اختر مربعًا مصورًا. يضيف Huda AAC الكلمة إلى الرسالة وينطقها بصوت مسموع.', icon: 'chatbubble-ellipses' },
          { title: 'أضف كلمات أخرى', body: 'اضغط على مربعات أخرى لتكوين رسالة. يعرض شريط الجملة فوق اللوحات الكلمات بالترتيب.', icon: 'grid-outline' },
          { title: 'استمع إلى الرسالة أو عدّلها', body: 'اضغط على زر Speak لسماع الرسالة كاملة. استخدم السهم المنحني لحذف آخر كلمة، أو رمز سلة المهملات لمسح الرسالة.', icon: 'megaphone' },
        ],
      },
      {
        title: 'استكشف الشاشة الرئيسية',
        icon: 'grid-outline',
        steps: [
          { title: 'انتقل بين اللوحات', body: 'مرّر صف اللوحات أسفل الرسالة للعثور على مجموعات الكلمات مثل الأشخاص والطعام والمنزل والمدرسة والمشاعر.', icon: 'grid-outline' },
          { title: 'افتح الأنشطة السريعة', body: 'تفتح الأزرار أعلى اليمين أقسام المشاعر والموسيقى الحسية والألعاب الحسية.', icon: 'game-controller-outline' },
          { title: 'خذ لحظة هادئة', body: 'اضغط على رمز القمر لتشغيل وضع الهدوء. اضغط على Exit Quiet Mode للعودة إلى لوحة التواصل.', icon: 'moon-outline' },
        ],
      },
      {
        title: 'أدوات مقدم الرعاية',
        icon: 'settings-outline',
        steps: [
          { title: 'افتح وضع مقدم الرعاية', body: 'اضغط على زر القائمة أعلى اليسار. إذا كنت قد عيّنت رقمًا سريًا لمقدم الرعاية، فأدخله للمتابعة.', icon: 'menu-outline' },
          { title: 'خصّص مربعات الصور', body: 'يمكن لمقدم الرعاية الضغط مطولًا على مربع لتغيير صورته أو اسمه أو صوته. افتح اللوحات في وضع مقدم الرعاية لإدارة اللوحات والمربعات.', icon: 'grid-outline' },
          { title: 'استخدم الإعدادات ومواد التعلّم', body: 'تتضمن الإعدادات اللغة والصوت والعرض والأمان. يحتوي دليل العلاج على دروس من Huda AAC وملخصات للمراجع محفوظة دون اتصال؛ أما مواقع المصادر فتحتاج إلى الإنترنت.', icon: 'book-outline' },
          { title: 'راجع التقارير', body: 'تعرض التقارير معلومات استخدام المربعات وتسجيلات المشاعر.', icon: 'bar-chart-outline' },
        ],
      },
    ],
    languageTitle: 'غيّر لغة الدليل',
    languageInstructions: 'من وضع مقدم الرعاية، افتح الإعدادات ← اللغة واختر لغة من القائمة. يتبع هذا الدليل اختيارك، ويعتمد النطق على توفر صوت مناسب في الجهاز.',
    languageNames: ['الإنجليزية', 'الإسبانية', 'الفرنسية', 'العربية', 'الألمانية', 'البرتغالية', 'الصينية', 'الهندية'],
    offlineTitle: 'لا حاجة إلى حساب',
    offlineBody: 'يفتح Huda AAC دون بريد إلكتروني أو حساب أو تسجيل دخول. هذا الدليل ومواد دليل العلاج محفوظة داخل التطبيق ويمكن استخدامها دون اتصال. يلزم الإنترنت لفتح مواقع المصادر.',
  },
  de: {
    title: 'Huda AAC verwenden',
    navSubtitle: 'Kurzanleitung',
    backLabel: 'Zurück zum Menü für Betreuungspersonen',
    introTitle: 'Mit einem Bild beginnen',
    introBody: 'Huda AAC unterstützt Kommunikation und Ruhe. Orientieren Sie sich am Tempo des Kindes – jede Art der Kommunikation ist willkommen.',
    sections: [
      {
        title: 'Eine Nachricht bilden',
        icon: 'chatbubble-ellipses',
        steps: [
          { title: 'Ein Bild antippen', body: 'Wählen Sie ein Bildfeld aus. Huda AAC fügt das Wort zur Nachricht hinzu und spricht es vor.', icon: 'chatbubble-ellipses' },
          { title: 'Weitere Wörter hinzufügen', body: 'Tippen Sie weitere Felder an, um eine Nachricht zu bilden. Die Satzleiste über den Tafeln zeigt die Wörter in der richtigen Reihenfolge.', icon: 'grid-outline' },
          { title: 'Nachricht anhören oder bearbeiten', body: 'Tippen Sie auf Speak, um die ganze Nachricht anzuhören. Mit dem gebogenen Pfeil entfernen Sie das letzte Wort; der Papierkorb löscht die Nachricht.', icon: 'megaphone' },
        ],
      },
      {
        title: 'Den Startbildschirm erkunden',
        icon: 'grid-outline',
        steps: [
          { title: 'Tafeln wechseln', body: 'Scrollen Sie durch die Leiste unter der Nachricht, um Wortgruppen wie Menschen, Essen, Zuhause, Schule oder Gefühle zu finden.', icon: 'grid-outline' },
          { title: 'Schnelle Aktivitäten öffnen', body: 'Über die Schaltflächen oben rechts gelangen Sie zu Gefühle, Sensorik-Musik und Sensorik-Spielen.', icon: 'game-controller-outline' },
          { title: 'Einen ruhigen Moment einlegen', body: 'Tippen Sie auf den Mond, um den Ruhemodus zu öffnen. Mit Ruhemodus beenden kehren Sie zur Kommunikationstafel zurück.', icon: 'moon-outline' },
        ],
      },
      {
        title: 'Werkzeuge für Betreuungspersonen',
        icon: 'settings-outline',
        steps: [
          { title: 'Betreuungsmodus öffnen', body: 'Tippen Sie oben links auf die Menütaste. Wenn eine PIN eingerichtet wurde, geben Sie diese ein.', icon: 'menu-outline' },
          { title: 'Bildfelder anpassen', body: 'Erwachsene können ein Feld gedrückt halten, um Bild, Beschriftung oder Ton zu ändern. Unter Tafeln im Betreuungsmodus lassen sich Tafeln und Felder verwalten.', icon: 'grid-outline' },
          { title: 'Einstellungen und Lernmaterial nutzen', body: 'Unter Einstellungen finden Sie Sprache, Stimme, Anzeige und Sicherheit. Der Therapie-Leitfaden enthält Huda AAC-Lektionen und gespeicherte Quellenzusammenfassungen für die Offline-Nutzung; die Quell-Websites benötigen Internet.', icon: 'book-outline' },
          { title: 'Berichte ansehen', body: 'Berichte zeigen die Nutzung der Bildfelder und Gefühls-Check-ins.', icon: 'bar-chart-outline' },
        ],
      },
    ],
    languageTitle: 'Sprache des Leitfadens ändern',
    languageInstructions: 'Öffnen Sie im Betreuungsmodus Einstellungen → Sprache und wählen Sie eine Sprache aus. Der Leitfaden folgt Ihrer Auswahl. Die Sprachausgabe setzt eine passende Stimme auf dem Gerät voraus.',
    languageNames: ['Englisch', 'Spanisch', 'Französisch', 'Arabisch', 'Deutsch', 'Portugiesisch', 'Chinesisch', 'Hindi'],
    offlineTitle: 'Kein Konto erforderlich',
    offlineBody: 'Huda AAC startet ohne E-Mail-Adresse, Konto oder Anmeldung. Dieser Leitfaden und die Materialien des Therapie-Leitfadens sind in der App gespeichert und offline verfügbar. Für externe Quell-Websites wird Internet benötigt.',
  },
  pt: {
    title: 'Como usar o Huda AAC',
    navSubtitle: 'Guia rápido',
    backLabel: 'Voltar ao menu do cuidador',
    introTitle: 'Comece com uma imagem',
    introBody: 'Huda AAC é um aplicativo de comunicação e tranquilidade. Respeite o ritmo da criança; toda forma de comunicação é bem-vinda.',
    sections: [
      {
        title: 'Monte uma mensagem',
        icon: 'chatbubble-ellipses',
        steps: [
          { title: 'Toque em uma imagem', body: 'Escolha um bloco com imagem. Huda AAC adiciona a palavra à mensagem e a fala em voz alta.', icon: 'chatbubble-ellipses' },
          { title: 'Adicione mais palavras', body: 'Toque em outros blocos para montar uma mensagem. A faixa de frases acima dos quadros mostra as palavras em ordem.', icon: 'grid-outline' },
          { title: 'Ouça ou edite a mensagem', body: 'Toque em Speak para ouvir a mensagem completa. Use a seta curva para remover a última palavra ou a lixeira para apagar a mensagem.', icon: 'megaphone' },
        ],
      },
      {
        title: 'Explore a tela inicial',
        icon: 'grid-outline',
        steps: [
          { title: 'Troque de quadro', body: 'Deslize a faixa abaixo da mensagem para encontrar grupos de palavras, como Pessoas, Comida, Casa, Escola ou Sentimentos.', icon: 'grid-outline' },
          { title: 'Abra atividades rápidas', body: 'Os botões no canto superior direito abrem Sentimentos, Música Sensorial e Jogos Sensoriais.', icon: 'game-controller-outline' },
          { title: 'Faça uma pausa tranquila', body: 'Toque na lua para ativar o Modo Tranquilo. Toque em Sair do Modo Tranquilo para voltar ao quadro de comunicação.', icon: 'moon-outline' },
        ],
      },
      {
        title: 'Ferramentas do cuidador',
        icon: 'settings-outline',
        steps: [
          { title: 'Abra o Modo do Cuidador', body: 'Toque no botão de menu no canto superior esquerdo. Se houver um PIN de cuidador, digite-o para continuar.', icon: 'menu-outline' },
          { title: 'Personalize os blocos com imagens', body: 'Um adulto pode manter um bloco pressionado para alterar a imagem, o rótulo ou o som. Abra Quadros no Modo do Cuidador para gerenciar quadros e blocos.', icon: 'grid-outline' },
          { title: 'Use as configurações e os materiais de aprendizagem', body: 'Configurações inclui idioma, voz, tela e segurança. O Guia de Terapia tem lições criadas pelo Huda AAC e resumos de referências salvos offline; os sites das fontes precisam de internet.', icon: 'book-outline' },
          { title: 'Veja os relatórios', body: 'Relatórios mostra o uso dos blocos e os registros de sentimentos.', icon: 'bar-chart-outline' },
        ],
      },
    ],
    languageTitle: 'Mude o idioma do guia',
    languageInstructions: 'No Modo do Cuidador, abra Configurações → Idioma e escolha uma opção abaixo. O guia acompanha sua escolha. A fala depende da disponibilidade de uma voz compatível no dispositivo.',
    languageNames: ['Inglês', 'Espanhol', 'Francês', 'Árabe', 'Alemão', 'Português', 'Chinês', 'Hindi'],
    offlineTitle: 'Não é necessária uma conta',
    offlineBody: 'Huda AAC abre sem e-mail, conta ou início de sessão. Este guia e os materiais do Guia de Terapia ficam salvos no aplicativo e podem ser usados offline. É preciso internet para abrir os sites das fontes.',
  },
  zh: {
    title: '如何使用 Huda AAC',
    navSubtitle: '快速指南',
    backLabel: '返回照护者菜单',
    introTitle: '从一张图片开始',
    introBody: 'Huda AAC 是一款帮助沟通和放松的应用。请按照孩子自己的节奏使用；每一种沟通方式都值得欢迎。',
    sections: [
      {
        title: '组成一条消息',
        icon: 'chatbubble-ellipses',
        steps: [
          { title: '点击一张图片', body: '选择一个图片格。Huda AAC 会把对应的词加入消息并朗读出来。', icon: 'chatbubble-ellipses' },
          { title: '添加更多词语', body: '继续点击其他图片格来组成消息。沟通板上方的句子栏会按顺序显示词语。', icon: 'grid-outline' },
          { title: '朗读或修改消息', body: '点击 Speak 收听完整消息。点击弯箭头删除最后一个词，点击垃圾桶清空消息。', icon: 'megaphone' },
        ],
      },
      {
        title: '了解主屏幕',
        icon: 'grid-outline',
        steps: [
          { title: '切换沟通板', body: '滑动消息下方的一排标签，查找人物、食物、家庭、学校或感受等词语分类。', icon: 'grid-outline' },
          { title: '打开快捷活动', body: '右上角的按钮可打开感受、感官音乐和感官游戏。', icon: 'game-controller-outline' },
          { title: '安静休息片刻', body: '点击月亮按钮进入安静模式。点击退出安静模式即可返回沟通板。', icon: 'moon-outline' },
        ],
      },
      {
        title: '照护者工具',
        icon: 'settings-outline',
        steps: [
          { title: '打开照护者模式', body: '点击左上角的菜单按钮。如果已设置照护者 PIN 码，请输入后继续。', icon: 'menu-outline' },
          { title: '自定义图片格', body: '成人可以长按图片格来更换图片、文字或声音。在照护者模式中打开沟通板，可管理沟通板和图片格。', icon: 'grid-outline' },
          { title: '使用设置和学习资料', body: '设置中可以调整语言、语音、显示和安全选项。治疗指南包含 Huda AAC 制作的课程和离线保存的参考资料摘要；查看原始网站需要联网。', icon: 'book-outline' },
          { title: '查看报告', body: '报告会显示图片格的使用情况和感受记录。', icon: 'bar-chart-outline' },
        ],
      },
    ],
    languageTitle: '更改指南语言',
    languageInstructions: '在照护者模式中打开“设置”→“语言”，然后选择下方的一种语言。指南会跟随此选择。语音朗读取决于设备是否提供兼容的语音。',
    languageNames: ['英语', '西班牙语', '法语', '阿拉伯语', '德语', '葡萄牙语', '中文', '印地语'],
    offlineTitle: '无需注册账号',
    offlineBody: '打开 Huda AAC 不需要电子邮件、账号或登录。此指南和治疗指南的学习材料保存在应用中，可离线使用。打开参考来源网站时需要联网。',
  },
  hi: {
    title: 'Huda AAC का उपयोग कैसे करें',
    navSubtitle: 'त्वरित मार्गदर्शिका',
    backLabel: 'देखभालकर्ता मेनू पर वापस जाएँ',
    introTitle: 'एक तस्वीर से शुरुआत करें',
    introBody: 'Huda AAC संवाद और शांति में मदद करने वाला ऐप है। बच्चे की गति के अनुसार चलें; संवाद करने का हर तरीका स्वागत योग्य है।',
    sections: [
      {
        title: 'एक संदेश बनाएँ',
        icon: 'chatbubble-ellipses',
        steps: [
          { title: 'किसी तस्वीर पर टैप करें', body: 'तस्वीर वाला कोई टाइल चुनें। Huda AAC उसका शब्द संदेश में जोड़ता है और उसे बोलकर सुनाता है।', icon: 'chatbubble-ellipses' },
          { title: 'और शब्द जोड़ें', body: 'संदेश बनाने के लिए और टाइल पर टैप करें। बोर्ड के ऊपर की वाक्य पट्टी शब्दों को क्रम से दिखाती है।', icon: 'grid-outline' },
          { title: 'संदेश सुनें या बदलें', body: 'पूरा संदेश सुनने के लिए Speak पर टैप करें। आखिरी शब्द हटाने के लिए मुड़े हुए तीर और संदेश मिटाने के लिए कूड़ेदान का उपयोग करें।', icon: 'megaphone' },
        ],
      },
      {
        title: 'होम स्क्रीन देखें',
        icon: 'grid-outline',
        steps: [
          { title: 'बोर्ड बदलें', body: 'संदेश के नीचे वाली पट्टी को स्क्रॉल करके लोग, खाना, घर, स्कूल या भावनाओं जैसे शब्द समूह खोजें।', icon: 'grid-outline' },
          { title: 'त्वरित गतिविधियाँ खोलें', body: 'ऊपर दाईं ओर के बटन भावनाएँ, संवेदी संगीत और संवेदी खेल खोलते हैं।', icon: 'game-controller-outline' },
          { title: 'शांत विराम लें', body: 'शांत मोड चालू करने के लिए चाँद पर टैप करें। बोर्ड पर लौटने के लिए शांत मोड से बाहर निकलें पर टैप करें।', icon: 'moon-outline' },
        ],
      },
      {
        title: 'देखभालकर्ता के टूल',
        icon: 'settings-outline',
        steps: [
          { title: 'देखभालकर्ता मोड खोलें', body: 'ऊपर बाईं ओर मेनू बटन पर टैप करें। यदि देखभालकर्ता PIN सेट है, तो आगे बढ़ने के लिए उसे दर्ज करें।', icon: 'menu-outline' },
          { title: 'तस्वीर वाले टाइल बदलें', body: 'कोई वयस्क टाइल को दबाकर रखकर उसकी तस्वीर, लेबल या ध्वनि बदल सकता है। बोर्ड और टाइल प्रबंधित करने के लिए देखभालकर्ता मोड में बोर्ड खोलें।', icon: 'grid-outline' },
          { title: 'सेटिंग और सीखने की सामग्री देखें', body: 'सेटिंग में भाषा, आवाज़, डिस्प्ले और सुरक्षा के विकल्प हैं। थेरेपी गाइड में Huda AAC के बनाए पाठ और ऑफलाइन सहेजे गए संदर्भ-सारांश हैं; स्रोत वेबसाइट खोलने के लिए इंटरनेट चाहिए।', icon: 'book-outline' },
          { title: 'रिपोर्ट देखें', body: 'रिपोर्ट में टाइल के उपयोग और भावनाओं के चेक-इन दिखाई देते हैं।', icon: 'bar-chart-outline' },
        ],
      },
    ],
    languageTitle: 'गाइड की भाषा बदलें',
    languageInstructions: 'देखभालकर्ता मोड में सेटिंग → भाषा खोलें और नीचे दी गई भाषा चुनें। गाइड उसी भाषा में दिखाई देगी। बोलने के लिए डिवाइस में संगत आवाज़ उपलब्ध होनी चाहिए।',
    languageNames: ['अंग्रेज़ी', 'स्पेनिश', 'फ़्रेंच', 'अरबी', 'जर्मन', 'पुर्तगाली', 'चीनी', 'हिन्दी'],
    offlineTitle: 'खाते की ज़रूरत नहीं',
    offlineBody: 'Huda AAC खोलने के लिए ईमेल, खाते या साइन-इन की ज़रूरत नहीं है। यह गाइड और थेरेपी गाइड की सामग्री ऐप में सहेजी जाती है और ऑफलाइन इस्तेमाल की जा सकती है। स्रोत वेबसाइट खोलने के लिए इंटरनेट चाहिए।',
  },
};
