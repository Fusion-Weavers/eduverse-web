// Sample multilingual content structure for Bengali and Hindi support
// This demonstrates how to add translations to your Firebase content

export const sampleConceptContent = {
  // English content
  en: {
    title: "Newton's First Law of Motion",
    summary:
      "An object at rest stays at rest and an object in motion stays in motion unless acted upon by an external force.",
    body: `Newton's First Law, also known as the Law of Inertia, states that an object will remain at rest or in uniform motion in a straight line unless acted upon by an external force.

## Key Concepts

**Inertia** is the tendency of an object to resist changes in its state of motion. The more mass an object has, the more inertia it possesses.

## Real-World Examples

• A book on a table remains at rest until someone picks it up
• A hockey puck sliding on ice continues moving until friction stops it
• Passengers in a car lurch forward when the car suddenly stops

## Mathematical Expression

If the net force F = 0, then velocity v = constant`,
    examples: [
      "A soccer ball remains stationary until kicked",
      "A satellite in space continues moving without fuel",
      "Seat belts prevent passengers from continuing forward during sudden stops",
    ],
  },

  // Hindi translation
  hi: {
    title: "न्यूटन का गति का प्रथम नियम",
    summary:
      "एक वस्तु विराम में रहती है और गति में रहने वाली वस्तु गति में रहती है जब तक कि उस पर कोई बाहरी बल न लगाया जाए।",
    body: `न्यूटन का प्रथम नियम, जिसे जड़त्व का नियम भी कहा जाता है, यह बताता है कि कोई वस्तु विराम में रहेगी या सीधी रेखा में एकसमान गति में रहेगी जब तक कि उस पर कोई बाहरी बल न लगाया जाए।

## मुख्य अवधारणाएं

**जड़त्व** किसी वस्तु की अपनी गति की स्थिति में परिवर्तन का विरोध करने की प्रवृत्ति है। किसी वस्तु में जितना अधिक द्रव्यमान होता है, उसमें उतना ही अधिक जड़त्व होता है।

## वास्तविक जीवन के उदाहरण

• मेज पर रखी किताब तब तक विराम में रहती है जब तक कोई उसे उठाता नहीं
• बर्फ पर फिसलता हॉकी पक तब तक चलता रहता है जब तक घर्षण उसे रोक नहीं देता
• कार के अचानक रुकने पर यात्री आगे की ओर झुक जाते हैं

## गणितीय व्यंजक

यदि शुद्ध बल F = 0, तो वेग v = स्थिरांक`,
    examples: [
      "फुटबॉल तब तक स्थिर रहती है जब तक उसे लात नहीं मारी जाती",
      "अंतरिक्ष में उपग्रह बिना ईंधन के चलता रहता है",
      "सीट बेल्ट अचानक रुकने के दौरान यात्रियों को आगे जाने से रोकती है",
    ],
  },

  // Bengali translation
  bn: {
    title: "নিউটনের গতির প্রথম সূত্র",
    summary:
      "একটি বস্তু স্থির থাকে এবং গতিশীল বস্তু গতিশীল থাকে যতক্ষণ না তার উপর কোনো বাহ্যিক বল প্রয়োগ করা হয়।",
    body: `নিউটনের প্রথম সূত্র, যা জড়তার সূত্র নামেও পরিচিত, বলে যে একটি বস্তু স্থির থাকবে বা সরলরেখায় সমান গতিতে চলতে থাকবে যতক্ষণ না তার উপর কোনো বাহ্যিক বল প্রয়োগ করা হয়।

## মূল ধারণা

**জড়তা** হল একটি বস্তুর তার গতির অবস্থায় পরিবর্তনের বিরোধিতা করার প্রবণতা। একটি বস্তুর যত বেশি ভর থাকে, তার তত বেশি জড়তা থাকে।

## বাস্তব জীবনের উদাহরণ

• টেবিলে রাখা বই স্থির থাকে যতক্ষণ না কেউ তা তুলে নেয়
• বরফের উপর পিছলে যাওয়া হকি পাক চলতে থাকে যতক্ষণ না ঘর্ষণ তা থামায়
• গাড়ি হঠাৎ থামলে যাত্রীরা সামনের দিকে ঝুঁকে পড়ে

## গাণিতিক রূপ

যদি নিট বল F = 0, তাহলে বেগ v = ধ্রুবক`,
    examples: [
      "ফুটবল বল স্থির থাকে যতক্ষণ না লাথি মারা হয়",
      "মহাকাশে উপগ্রহ জ্বালানি ছাড়াই চলতে থাকে",
      "সিট বেল্ট হঠাৎ থামার সময় যাত্রীদের সামনে যাওয়া থেকে বিরত রাখে",
    ],
  },
};

// Sample subject translations
export const sampleSubjectTranslations = {
  physics: {
    en: {
      name: "Physics",
      description:
        "Study of matter, energy, and the fundamental forces of nature",
    },
    hi: {
      name: "भौतिकी",
      description: "पदार्थ, ऊर्जा और प्रकृति के मौलिक बलों का अध्ययन",
    },
    bn: {
      name: "পদার্থবিজ্ঞান",
      description: "পদার্থ, শক্তি এবং প্রকৃতির মৌলিক শক্তির অধ্যয়ন",
    },
  },
  chemistry: {
    en: {
      name: "Chemistry",
      description:
        "Study of substances, their properties, and how they interact",
    },
    hi: {
      name: "रसायन विज्ञान",
      description: "पदार्थों, उनके गुणों और उनकी परस्पर क्रिया का अध्ययन",
    },
    bn: {
      name: "রসায়ন",
      description:
        "পদার্থ, তাদের বৈশিষ্ট্য এবং তারা কীভাবে মিথস্ক্রিয়া করে তার অধ্যয়ন",
    },
  },
  biology: {
    en: {
      name: "Biology",
      description: "Study of living organisms and life processes",
    },
    hi: {
      name: "जीव विज्ञान",
      description: "जीवित जीवों और जीवन प्रक्रियाओं का अध्ययन",
    },
    bn: {
      name: "জীববিজ্ঞান",
      description: "জীবন্ত প্রাণী এবং জীবন প্রক্রিয়ার অধ্যয়ন",
    },
  },
};

// UI translations for common elements
export const uiTranslations = {
  navigation: {
    en: {
      home: "Home",
      subjects: "Subjects",
      arModels: "3D Models",
      favorites: "Favorites",
      profile: "Profile",
      search: "Search",
    },
    hi: {
      home: "होम",
      subjects: "विषय",
      arModels: "3D मॉडल",
      favorites: "पसंदीदा",
      profile: "प्रोफ़ाइल",
      search: "खोजें",
    },
    bn: {
      home: "হোম",
      subjects: "বিষয়",
      arModels: "3D মডেল",
      favorites: "প্রিয়",
      profile: "প্রোফাইল",
      search: "অনুসন্ধান",
    },
  },
  actions: {
    en: {
      viewMore: "View More",
      startLearning: "Start Learning",
      backToSubjects: "Back to Subjects",
      addToFavorites: "Add to Favorites",
      removeFromFavorites: "Remove from Favorites",
    },
    hi: {
      viewMore: "और देखें",
      startLearning: "सीखना शुरू करें",
      backToSubjects: "विषयों पर वापस जाएं",
      addToFavorites: "पसंदीदा में जोड़ें",
      removeFromFavorites: "पसंदीदा से हटाएं",
    },
    bn: {
      viewMore: "আরও দেখুন",
      startLearning: "শেখা শুরু করুন",
      backToSubjects: "বিষয়ে ফিরে যান",
      addToFavorites: "প্রিয়তে যোগ করুন",
      removeFromFavorites: "প্রিয় থেকে সরান",
    },
  },
};
