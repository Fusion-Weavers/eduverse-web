# Flutter Implementation Guide for Eduverse

## Multilingual STEM Learning Platform

This guide provides a comprehensive roadmap to implement the Eduverse learning platform in Flutter, based on the existing React web application. Since authentication is already completed, this guide focuses on the remaining features needed to create a complete mobile learning experience.

## 🎯 Project Overview

**Eduverse** is a multilingual STEM learning platform designed to help rural and non-English students understand complex STEM concepts through localized language explanations. The mobile app will provide structured browsing, search functionality, multilingual content support, and user personalization features.

### Key Features to Implement

- **Subject Organization**: Browse STEM content (Engineering, Physics, Biology, Chemistry)
- **Multilingual Support**: Access content in 12+ languages with AI translation
- **Search & Discovery**: Find concepts with advanced filtering
- **Favorites System**: Save and organize favorite topics and concepts
- **User Profiles**: Manage preferences and track learning progress
- **Offline Reading**: Access previously viewed content without internet

## 📱 App Architecture Overview

### Core Structure

```
lib/
├── main.dart
├── models/
│   ├── subject.dart
│   ├── topic.dart
│   ├── concept.dart
│   └── user_stats.dart
├── services/
│   ├── firestore_service.dart
│   ├── translation_service.dart
│   ├── favorites_service.dart
│   └── search_service.dart
├── providers/
│   ├── content_provider.dart
│   ├── language_provider.dart
│   ├── favorites_provider.dart
│   └── search_provider.dart
├── screens/
│   ├── home_screen.dart
│   ├── subjects_screen.dart
│   ├── topic_list_screen.dart
│   ├── concept_view_screen.dart
│   ├── search_screen.dart
│   ├── favorites_screen.dart
│   └── profile_screen.dart
├── widgets/
│   ├── common/
│   ├── subject_card.dart
│   ├── topic_card.dart
│   ├── concept_card.dart
│   ├── search_bar.dart
│   ├── language_selector.dart
│   └── favorite_button.dart
└── utils/
    ├── constants.dart
    ├── theme.dart
    └── helpers.dart
```

## 🚀 Implementation Steps

### Step 1: Setup Dependencies

Add these dependencies to your `pubspec.yaml`:

```yaml
dependencies:
  flutter:
    sdk: flutter

  # State Management
  provider: ^6.1.1

  # Firebase
  firebase_core: ^2.24.2
  cloud_firestore: ^4.13.6
  firebase_auth: ^4.15.3

  # UI Components
  flutter_svg: ^2.0.9
  cached_network_image: ^3.3.0
  shimmer: ^3.0.0

  # Navigation
  go_router: ^12.1.3

  # Local Storage
  shared_preferences: ^2.2.2
  hive: ^2.2.3
  hive_flutter: ^1.1.0

  # HTTP & API
  http: ^1.1.2
  dio: ^5.4.0

  # Utilities
  intl: ^0.19.0
  uuid: ^4.2.1

  # Google AI (for translation)
  google_generative_ai: ^0.2.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  hive_generator: ^2.0.1
  build_runner: ^2.4.7
```

### Step 2: Data Models

Create the core data models:

#### `lib/models/subject.dart`

```dart
class Subject {
  final String id;
  final String name;
  final String description;
  final String icon;
  final int topicCount;
  final String difficulty;
  final List<String> prerequisites;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Subject({
    required this.id,
    required this.name,
    required this.description,
    required this.icon,
    this.topicCount = 0,
    this.difficulty = 'intermediate',
    this.prerequisites = const [],
    this.createdAt,
    this.updatedAt,
  });

  factory Subject.fromFirestore(Map<String, dynamic> data, String id) {
    return Subject(
      id: id,
      name: data['name'] ?? '',
      description: data['description'] ?? '',
      icon: data['icon'] ?? 'book',
      topicCount: data['topicCount'] ?? 0,
      difficulty: data['difficulty'] ?? 'intermediate',
      prerequisites: List<String>.from(data['prerequisites'] ?? []),
      createdAt: data['createdAt']?.toDate(),
      updatedAt: data['updatedAt']?.toDate(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'description': description,
      'icon': icon,
      'topicCount': topicCount,
      'difficulty': difficulty,
      'prerequisites': prerequisites,
      'createdAt': createdAt,
      'updatedAt': updatedAt,
    };
  }
}
```

#### `lib/models/topic.dart`

```dart
class Topic {
  final String id;
  final String subjectId;
  final String name;
  final String description;
  final String difficulty;
  final int conceptCount;
  final int estimatedTime;
  final List<String> prerequisites;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Topic({
    required this.id,
    required this.subjectId,
    required this.name,
    required this.description,
    this.difficulty = 'intermediate',
    this.conceptCount = 0,
    this.estimatedTime = 0,
    this.prerequisites = const [],
    this.createdAt,
    this.updatedAt,
  });

  factory Topic.fromFirestore(Map<String, dynamic> data, String id) {
    return Topic(
      id: id,
      subjectId: data['subjectId'] ?? '',
      name: data['name'] ?? '',
      description: data['description'] ?? '',
      difficulty: data['difficulty'] ?? 'intermediate',
      conceptCount: data['conceptCount'] ?? 0,
      estimatedTime: data['estimatedTime'] ?? 0,
      prerequisites: List<String>.from(data['prerequisites'] ?? []),
      createdAt: data['createdAt']?.toDate(),
      updatedAt: data['updatedAt']?.toDate(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'subjectId': subjectId,
      'name': name,
      'description': description,
      'difficulty': difficulty,
      'conceptCount': conceptCount,
      'estimatedTime': estimatedTime,
      'prerequisites': prerequisites,
      'createdAt': createdAt,
      'updatedAt': updatedAt,
    };
  }
}
```

#### `lib/models/concept.dart`

```dart
class ConceptContent {
  final String title;
  final String? summary;
  final String body;
  final List<String>? examples;
  final List<String>? images;
  final List<String>? externalAssets;

  ConceptContent({
    required this.title,
    this.summary,
    required this.body,
    this.examples,
    this.images,
    this.externalAssets,
  });

  factory ConceptContent.fromMap(Map<String, dynamic> data) {
    return ConceptContent(
      title: data['title'] ?? '',
      summary: data['summary'],
      body: data['body'] ?? '',
      examples: data['examples'] != null
          ? List<String>.from(data['examples'])
          : null,
      images: data['images'] != null
          ? List<String>.from(data['images'])
          : null,
      externalAssets: data['externalAssets'] != null
          ? List<String>.from(data['externalAssets'])
          : null,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'title': title,
      'summary': summary,
      'body': body,
      'examples': examples,
      'images': images,
      'externalAssets': externalAssets,
    };
  }
}

class Concept {
  final String id;
  final String topicId;
  final String title;
  final String difficulty;
  final int estimatedReadTime;
  final Map<String, ConceptContent> content; // Multi-language content
  final List<String> relatedConcepts;
  final bool arEnabled;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Concept({
    required this.id,
    required this.topicId,
    required this.title,
    this.difficulty = 'intermediate',
    this.estimatedReadTime = 5,
    required this.content,
    this.relatedConcepts = const [],
    this.arEnabled = false,
    this.createdAt,
    this.updatedAt,
  });

  factory Concept.fromFirestore(Map<String, dynamic> data, String id) {
    Map<String, ConceptContent> contentMap = {};
    if (data['content'] != null) {
      Map<String, dynamic> contentData = Map<String, dynamic>.from(data['content']);
      contentData.forEach((lang, content) {
        contentMap[lang] = ConceptContent.fromMap(Map<String, dynamic>.from(content));
      });
    }

    return Concept(
      id: id,
      topicId: data['topicId'] ?? '',
      title: data['title'] ?? '',
      difficulty: data['difficulty'] ?? 'intermediate',
      estimatedReadTime: data['estimatedReadTime'] ?? 5,
      content: contentMap,
      relatedConcepts: List<String>.from(data['relatedConcepts'] ?? []),
      arEnabled: data['arEnabled'] ?? false,
      createdAt: data['createdAt']?.toDate(),
      updatedAt: data['updatedAt']?.toDate(),
    );
  }

  Map<String, dynamic> toMap() {
    Map<String, dynamic> contentMap = {};
    content.forEach((lang, content) {
      contentMap[lang] = content.toMap();
    });

    return {
      'topicId': topicId,
      'title': title,
      'difficulty': difficulty,
      'estimatedReadTime': estimatedReadTime,
      'content': contentMap,
      'relatedConcepts': relatedConcepts,
      'arEnabled': arEnabled,
      'createdAt': createdAt,
      'updatedAt': updatedAt,
    };
  }
}
```

### Step 3: Core Services

#### `lib/services/firestore_service.dart`

```dart
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/subject.dart';
import '../models/topic.dart';
import '../models/concept.dart';

class FirestoreService {
  static final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Subjects
  static Future<List<Subject>> getAllSubjects() async {
    try {
      QuerySnapshot snapshot = await _firestore
          .collection('subjects')
          .orderBy('name')
          .get();

      return snapshot.docs
          .map((doc) => Subject.fromFirestore(
              doc.data() as Map<String, dynamic>, doc.id))
          .toList();
    } catch (e) {
      throw Exception('Failed to load subjects: $e');
    }
  }

  static Future<Subject?> getSubjectById(String id) async {
    try {
      DocumentSnapshot doc = await _firestore
          .collection('subjects')
          .doc(id)
          .get();

      if (doc.exists) {
        return Subject.fromFirestore(
            doc.data() as Map<String, dynamic>, doc.id);
      }
      return null;
    } catch (e) {
      throw Exception('Failed to load subject: $e');
    }
  }

  // Topics
  static Future<List<Topic>> getTopicsBySubject(String subjectId) async {
    try {
      QuerySnapshot snapshot = await _firestore
          .collection('topics')
          .where('subjectId', isEqualTo: subjectId)
          .orderBy('name')
          .get();

      return snapshot.docs
          .map((doc) => Topic.fromFirestore(
              doc.data() as Map<String, dynamic>, doc.id))
          .toList();
    } catch (e) {
      throw Exception('Failed to load topics: $e');
    }
  }

  static Future<List<Topic>> getAllTopics() async {
    try {
      QuerySnapshot snapshot = await _firestore
          .collection('topics')
          .orderBy('name')
          .get();

      return snapshot.docs
          .map((doc) => Topic.fromFirestore(
              doc.data() as Map<String, dynamic>, doc.id))
          .toList();
    } catch (e) {
      throw Exception('Failed to load topics: $e');
    }
  }

  // Concepts
  static Future<List<Concept>> getConceptsByTopic(String topicId) async {
    try {
      QuerySnapshot snapshot = await _firestore
          .collection('concepts')
          .where('topicId', isEqualTo: topicId)
          .orderBy('title')
          .get();

      return snapshot.docs
          .map((doc) => Concept.fromFirestore(
              doc.data() as Map<String, dynamic>, doc.id))
          .toList();
    } catch (e) {
      throw Exception('Failed to load concepts: $e');
    }
  }

  static Future<List<Concept>> getAllConcepts() async {
    try {
      QuerySnapshot snapshot = await _firestore
          .collection('concepts')
          .orderBy('title')
          .get();

      return snapshot.docs
          .map((doc) => Concept.fromFirestore(
              doc.data() as Map<String, dynamic>, doc.id))
          .toList();
    } catch (e) {
      throw Exception('Failed to load concepts: $e');
    }
  }

  // Search
  static Future<List<Map<String, dynamic>>> searchContent(
      String query, String scope) async {
    try {
      List<Map<String, dynamic>> results = [];

      if (scope == 'all' || scope == 'subjects') {
        QuerySnapshot subjectSnapshot = await _firestore
            .collection('subjects')
            .where('name', isGreaterThanOrEqualTo: query)
            .where('name', isLessThan: query + 'z')
            .get();

        for (var doc in subjectSnapshot.docs) {
          results.add({
            'id': doc.id,
            'type': 'subject',
            'title': doc['name'],
            'description': doc['description'],
            'data': doc.data(),
          });
        }
      }

      if (scope == 'all' || scope == 'topics') {
        QuerySnapshot topicSnapshot = await _firestore
            .collection('topics')
            .where('name', isGreaterThanOrEqualTo: query)
            .where('name', isLessThan: query + 'z')
            .get();

        for (var doc in topicSnapshot.docs) {
          results.add({
            'id': doc.id,
            'type': 'topic',
            'title': doc['name'],
            'description': doc['description'],
            'data': doc.data(),
          });
        }
      }

      if (scope == 'all' || scope == 'concepts') {
        QuerySnapshot conceptSnapshot = await _firestore
            .collection('concepts')
            .where('title', isGreaterThanOrEqualTo: query)
            .where('title', isLessThan: query + 'z')
            .get();

        for (var doc in conceptSnapshot.docs) {
          results.add({
            'id': doc.id,
            'type': 'concept',
            'title': doc['title'],
            'description': doc['content']['en']['summary'] ?? '',
            'data': doc.data(),
          });
        }
      }

      return results;
    } catch (e) {
      throw Exception('Search failed: $e');
    }
  }

  // User activity tracking
  static Future<void> trackUserActivity(
      String userId, String activityType, String contentId,
      {Map<String, dynamic>? metadata}) async {
    try {
      await _firestore
          .collection('user_activities')
          .add({
        'userId': userId,
        'activityType': activityType,
        'contentId': contentId,
        'metadata': metadata ?? {},
        'timestamp': FieldValue.serverTimestamp(),
      });
    } catch (e) {
      print('Failed to track activity: $e');
    }
  }
}
```

#### `lib/services/translation_service.dart`

````dart
import 'dart:convert';
import 'package:google_generative_ai/google_generative_ai.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/concept.dart';

class TranslationService {
  static GenerativeModel? _model;
  static const String _apiKey = 'YOUR_GEMINI_API_KEY'; // Replace with your API key

  static final List<Map<String, String>> supportedLanguages = [
    {'code': 'en', 'name': 'English', 'nativeName': 'English'},
    {'code': 'es', 'name': 'Spanish', 'nativeName': 'Español'},
    {'code': 'fr', 'name': 'French', 'nativeName': 'Français'},
    {'code': 'de', 'name': 'German', 'nativeName': 'Deutsch'},
    {'code': 'hi', 'name': 'Hindi', 'nativeName': 'हिन्दी'},
    {'code': 'bn', 'name': 'Bengali', 'nativeName': 'বাংলা'},
    {'code': 'ta', 'name': 'Tamil', 'nativeName': 'தமிழ்'},
    {'code': 'te', 'name': 'Telugu', 'nativeName': 'తెలుగు'},
    {'code': 'ur', 'name': 'Urdu', 'nativeName': 'اردو'},
    {'code': 'zh', 'name': 'Chinese', 'nativeName': '中文'},
    {'code': 'ja', 'name': 'Japanese', 'nativeName': '日本語'},
    {'code': 'ko', 'name': 'Korean', 'nativeName': '한국어'},
  ];

  static void initialize() {
    if (_apiKey.isNotEmpty && _apiKey != 'YOUR_GEMINI_API_KEY') {
      _model = GenerativeModel(
        model: 'gemini-2.5-flash',
        apiKey: _apiKey,
      );
    }
  }

  static bool get isAvailable => _model != null;

  static String getLanguageDisplayName(String languageCode) {
    final language = supportedLanguages.firstWhere(
      (lang) => lang['code'] == languageCode,
      orElse: () => {'nativeName': languageCode},
    );
    return language['nativeName']!;
  }

  static Future<ConceptContent?> getLocalizedContent(
    Map<String, ConceptContent> content,
    String targetLanguage,
    String contentId, {
    Map<String, String>? context,
  }) async {
    // Return existing content if available
    if (content.containsKey(targetLanguage)) {
      return content[targetLanguage];
    }

    // Check cache first
    final cached = await _getCachedTranslation(contentId, targetLanguage);
    if (cached != null) {
      return cached;
    }

    // Try to translate from English or first available language
    final sourceLanguage = content.containsKey('en') ? 'en' : content.keys.first;
    final sourceContent = content[sourceLanguage];

    if (sourceContent == null || !isAvailable) {
      return sourceContent; // Return fallback content
    }

    try {
      final translated = await _translateContent(
        sourceContent,
        targetLanguage,
        context ?? {},
      );

      if (translated != null) {
        await _cacheTranslation(contentId, targetLanguage, translated);
        return translated;
      }
    } catch (e) {
      print('Translation failed: $e');
    }

    return sourceContent; // Return fallback content
  }

  static Future<ConceptContent?> _translateContent(
    ConceptContent content,
    String targetLanguage,
    Map<String, String> context,
  ) async {
    if (_model == null) return null;

    final languageInfo = supportedLanguages.firstWhere(
      (lang) => lang['code'] == targetLanguage,
      orElse: () => {'name': targetLanguage},
    );

    final prompt = '''
You are an expert educational content translator specializing in STEM subjects.

Translate the following educational content to ${languageInfo['name']}.

IMPORTANT REQUIREMENTS:
1. Maintain technical accuracy and scientific terminology precision
2. Adapt explanations for educational clarity while preserving meaning
3. Keep the same JSON structure in your response
4. Translate all text fields but keep field names in English
5. Ensure age-appropriate language for ${context['difficulty'] ?? 'intermediate'} level students
6. Preserve any mathematical formulas, chemical equations, or scientific notation exactly

Context: Subject: ${context['subject'] ?? 'General STEM'}, Difficulty: ${context['difficulty'] ?? 'intermediate'}

Content to translate:
${jsonEncode(content.toMap())}

Respond with ONLY the translated JSON object, no additional text or explanation.
''';

    try {
      final response = await _model!.generateContent([Content.text(prompt)]);
      final translatedText = response.text?.trim() ?? '';

      // Parse JSON response
      String cleanedText = translatedText;
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.substring(7);
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.substring(3);
      }
      if (cleanedText.endsWith('```')) {
        cleanedText = cleanedText.substring(0, cleanedText.length - 3);
      }

      final translatedData = jsonDecode(cleanedText.trim());
      return ConceptContent.fromMap(Map<String, dynamic>.from(translatedData));
    } catch (e) {
      print('Translation error: $e');
      return null;
    }
  }

  static Future<ConceptContent?> _getCachedTranslation(
    String contentId,
    String language,
  ) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final cacheKey = 'translation_${contentId}_$language';
      final cached = prefs.getString(cacheKey);

      if (cached != null) {
        final cacheData = jsonDecode(cached);
        final cacheTime = DateTime.parse(cacheData['timestamp']);
        final now = DateTime.now();

        // Cache valid for 7 days
        if (now.difference(cacheTime).inDays < 7) {
          return ConceptContent.fromMap(
            Map<String, dynamic>.from(cacheData['data'])
          );
        } else {
          prefs.remove(cacheKey);
        }
      }
    } catch (e) {
      print('Error reading translation cache: $e');
    }
    return null;
  }

  static Future<void> _cacheTranslation(
    String contentId,
    String language,
    ConceptContent content,
  ) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final cacheKey = 'translation_${contentId}_$language';
      final cacheData = {
        'data': content.toMap(),
        'timestamp': DateTime.now().toIso8601String(),
      };
      await prefs.setString(cacheKey, jsonEncode(cacheData));
    } catch (e) {
      print('Error caching translation: $e');
    }
  }

  static Future<void> clearTranslationCache() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final keys = prefs.getKeys();
      final translationKeys = keys.where((key) => key.startsWith('translation_'));

      for (final key in translationKeys) {
        await prefs.remove(key);
      }
    } catch (e) {
      print('Error clearing translation cache: $e');
    }
  }
}
````

### Step 4: State Management with Provider

#### `lib/providers/content_provider.dart`

```dart
import 'package:flutter/foundation.dart';
import '../models/subject.dart';
import '../models/topic.dart';
import '../models/concept.dart';
import '../services/firestore_service.dart';

class ContentProvider with ChangeNotifier {
  List<Subject> _subjects = [];
  List<Topic> _topics = [];
  List<Concept> _concepts = [];
  bool _loading = false;
  String? _error;

  List<Subject> get subjects => _subjects;
  List<Topic> get topics => _topics;
  List<Concept> get concepts => _concepts;
  bool get loading => _loading;
  String? get error => _error;

  int get totalSubjects => _subjects.length;
  int get totalTopics => _topics.length;
  int get totalConcepts => _concepts.length;

  Future<void> loadAllData() async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      final results = await Future.wait([
        FirestoreService.getAllSubjects(),
        FirestoreService.getAllTopics(),
        FirestoreService.getAllConcepts(),
      ]);

      _subjects = results[0] as List<Subject>;
      _topics = results[1] as List<Topic>;
      _concepts = results[2] as List<Concept>;
      _error = null;
    } catch (e) {
      _error = 'Failed to load content: $e';
      print(_error);
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  List<Topic> getTopicsBySubject(String subjectId) {
    return _topics.where((topic) => topic.subjectId == subjectId).toList();
  }

  List<Concept> getConceptsByTopic(String topicId) {
    return _concepts.where((concept) => concept.topicId == topicId).toList();
  }

  Subject? getSubjectById(String subjectId) {
    try {
      return _subjects.firstWhere((subject) => subject.id == subjectId);
    } catch (e) {
      return null;
    }
  }

  Topic? getTopicById(String topicId) {
    try {
      return _topics.firstWhere((topic) => topic.id == topicId);
    } catch (e) {
      return null;
    }
  }

  Concept? getConceptById(String conceptId) {
    try {
      return _concepts.firstWhere((concept) => concept.id == conceptId);
    } catch (e) {
      return null;
    }
  }

  Future<void> refreshData() async {
    await loadAllData();
  }

  Future<void> trackUserActivity(
    String userId,
    String activityType,
    String contentId, {
    Map<String, dynamic>? metadata,
  }) async {
    try {
      await FirestoreService.trackUserActivity(
        userId,
        activityType,
        contentId,
        metadata: metadata,
      );
    } catch (e) {
      print('Failed to track activity: $e');
    }
  }
}
```

#### `lib/providers/language_provider.dart`

```dart
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/translation_service.dart';
import '../models/concept.dart';

class LanguageProvider with ChangeNotifier {
  String _currentLanguage = 'en';
  String _fallbackLanguage = 'en';
  bool _isTranslating = false;
  String? _translationError;

  String get currentLanguage => _currentLanguage;
  String get fallbackLanguage => _fallbackLanguage;
  bool get isTranslating => _isTranslating;
  String? get translationError => _translationError;
  bool get isGeminiAvailable => TranslationService.isAvailable;
  List<Map<String, String>> get supportedLanguages => TranslationService.supportedLanguages;

  LanguageProvider() {
    _loadLanguagePreferences();
    TranslationService.initialize();
  }

  Future<void> _loadLanguagePreferences() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      _currentLanguage = prefs.getString('preferred_language') ?? 'en';
      _fallbackLanguage = prefs.getString('fallback_language') ?? 'en';
      notifyListeners();
    } catch (e) {
      print('Error loading language preferences: $e');
    }
  }

  Future<void> changeLanguage(String languageCode) async {
    if (_isLanguageSupported(languageCode)) {
      _currentLanguage = languageCode;
      _translationError = null;
      notifyListeners();

      try {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('preferred_language', languageCode);
      } catch (e) {
        print('Error saving language preference: $e');
      }
    }
  }

  Future<void> changeFallbackLanguage(String languageCode) async {
    if (_isLanguageSupported(languageCode)) {
      _fallbackLanguage = languageCode;
      notifyListeners();

      try {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('fallback_language', languageCode);
      } catch (e) {
        print('Error saving fallback language preference: $e');
      }
    }
  }

  bool _isLanguageSupported(String languageCode) {
    return supportedLanguages.any((lang) => lang['code'] == languageCode);
  }

  String getLanguageDisplayName(String languageCode) {
    return TranslationService.getLanguageDisplayName(languageCode);
  }

  Future<LocalizedContentResult> getLocalizedContent(
    Map<String, ConceptContent> content,
    String contentId, {
    Map<String, String>? context,
  }) async {
    _isTranslating = true;
    _translationError = null;
    notifyListeners();

    try {
      final localizedContent = await TranslationService.getLocalizedContent(
        content,
        _currentLanguage,
        contentId,
        context: context,
      );

      final result = LocalizedContentResult(
        content: localizedContent ?? content[_fallbackLanguage] ?? content.values.first,
        language: localizedContent != null ? _currentLanguage :
                 (content.containsKey(_fallbackLanguage) ? _fallbackLanguage : content.keys.first),
        isTranslated: localizedContent != null && !content.containsKey(_currentLanguage),
        isFallback: localizedContent == null && _currentLanguage != _fallbackLanguage,
        fallbackReason: localizedContent == null ?
                       (isGeminiAvailable ? 'translation_failed' : 'translation_unavailable') :
                       null,
      );

      return result;
    } catch (e) {
      _translationError = e.toString();

      // Return fallback content
      final fallbackContent = content[_fallbackLanguage] ?? content.values.first;
      return LocalizedContentResult(
        content: fallbackContent,
        language: content.containsKey(_fallbackLanguage) ? _fallbackLanguage : content.keys.first,
        isTranslated: false,
        isFallback: true,
        fallbackReason: 'error',
      );
    } finally {
      _isTranslating = false;
      notifyListeners();
    }
  }

  Future<void> clearTranslationCache() async {
    await TranslationService.clearTranslationCache();
  }
}

class LocalizedContentResult {
  final ConceptContent content;
  final String language;
  final bool isTranslated;
  final bool isFallback;
  final String? fallbackReason;

  LocalizedContentResult({
    required this.content,
    required this.language,
    this.isTranslated = false,
    this.isFallback = false,
    this.fallbackReason,
  });
}
```

#### `lib/providers/favorites_provider.dart`

```dart
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class FavoritesProvider with ChangeNotifier {
  List<String> _favoriteTopics = [];
  List<String> _favoriteConcepts = [];
  String? _userId;
  bool _isOnline = true;
  String _syncStatus = 'synced'; // 'synced', 'syncing', 'pending'

  List<String> get favoriteTopics => _favoriteTopics;
  List<String> get favoriteConcepts => _favoriteConcepts;
  bool get isOnline => _isOnline;
  String get syncStatus => _syncStatus;

  void setUserId(String? userId) {
    _userId = userId;
    if (userId != null) {
      _loadFavorites();
    } else {
      _clearFavorites();
    }
  }

  Future<void> _loadFavorites() async {
    if (_userId == null) return;

    try {
      final prefs = await SharedPreferences.getInstance();
      final topicsJson = prefs.getString('favorites_topics_$_userId');
      final conceptsJson = prefs.getString('favorites_concepts_$_userId');

      if (topicsJson != null) {
        _favoriteTopics = List<String>.from(jsonDecode(topicsJson));
      }

      if (conceptsJson != null) {
        _favoriteConcepts = List<String>.from(jsonDecode(conceptsJson));
      }

      notifyListeners();
    } catch (e) {
      print('Error loading favorites: $e');
    }
  }

  void _clearFavorites() {
    _favoriteTopics.clear();
    _favoriteConcepts.clear();
    notifyListeners();
  }

  Future<void> _saveFavorites() async {
    if (_userId == null) return;

    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('favorites_topics_$_userId', jsonEncode(_favoriteTopics));
      await prefs.setString('favorites_concepts_$_userId', jsonEncode(_favoriteConcepts));
    } catch (e) {
      print('Error saving favorites: $e');
    }
  }

  bool isTopicFavorited(String topicId) {
    return _favoriteTopics.contains(topicId);
  }

  bool isConceptFavorited(String conceptId) {
    return _favoriteConcepts.contains(conceptId);
  }

  Future<bool> toggleTopicFavorite(String topicId) async {
    if (_userId == null) return false;

    final isFavorited = _favoriteTopics.contains(topicId);

    if (isFavorited) {
      _favoriteTopics.remove(topicId);
    } else {
      _favoriteTopics.add(topicId);
    }

    await _saveFavorites();
    notifyListeners();

    return !isFavorited;
  }

  Future<bool> toggleConceptFavorite(String conceptId) async {
    if (_userId == null) return false;

    final isFavorited = _favoriteConcepts.contains(conceptId);

    if (isFavorited) {
      _favoriteConcepts.remove(conceptId);
    } else {
      _favoriteConcepts.add(conceptId);
    }

    await _saveFavorites();
    notifyListeners();

    return !isFavorited;
  }

  int getTotalFavoritesCount() {
    return _favoriteTopics.length + _favoriteConcepts.length;
  }

  Future<void> clearAllFavorites() async {
    _favoriteTopics.clear();
    _favoriteConcepts.clear();
    await _saveFavorites();
    notifyListeners();
  }
}
```

### Step 5: Main Screens Implementation

#### `lib/screens/home_screen.dart`

```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/content_provider.dart';
import '../widgets/search_bar.dart';
import '../widgets/subject_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ContentProvider>().loadAllData();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Eduverse'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: Consumer<ContentProvider>(
        builder: (context, contentProvider, child) {
          if (contentProvider.loading) {
            return const Center(
              child: CircularProgressIndicator(),
            );
          }

          if (contentProvider.error != null) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.error_outline,
                    size: 64,
                    color: Theme.of(context).colorScheme.error,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Error Loading Content',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    contentProvider.error!,
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => contentProvider.loadAllData(),
                    child: const Text('Try Again'),
                  ),
                ],
              ),
            );
          }

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Welcome Section
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Welcome to Eduverse',
                          style: Theme.of(context).textTheme.headlineSmall,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Learn STEM concepts in your preferred language with structured, easy-to-understand explanations.',
                          style: Theme.of(context).textTheme.bodyMedium,
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 24),

                // Search Section
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Find What You\'re Looking For',
                          style: Theme.of(context).textTheme.titleLarge,
                        ),
                        const SizedBox(height: 12),
                        const CustomSearchBar(),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 24),

                // Stats Section
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _buildStatItem(
                          context,
                          'Subjects',
                          contentProvider.totalSubjects.toString(),
                          Icons.school,
                        ),
                        _buildStatItem(
                          context,
                          'Topics',
                          contentProvider.totalTopics.toString(),
                          Icons.topic,
                        ),
                        _buildStatItem(
                          context,
                          'Concepts',
                          contentProvider.totalConcepts.toString(),
                          Icons.lightbulb,
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 24),

                // Quick Access to Subjects
                Text(
                  'Explore Subjects',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const SizedBox(height: 12),

                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    childAspectRatio: 1.2,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                  ),
                  itemCount: contentProvider.subjects.length,
                  itemBuilder: (context, index) {
                    final subject = contentProvider.subjects[index];
                    return SubjectCard(
                      subject: subject,
                      onTap: () {
                        Navigator.pushNamed(
                          context,
                          '/subjects/${subject.id}',
                        );
                      },
                    );
                  },
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildStatItem(BuildContext context, String label, String value, IconData icon) {
    return Column(
      children: [
        Icon(
          icon,
          size: 32,
          color: Theme.of(context).colorScheme.primary,
        ),
        const SizedBox(height: 8),
        Text(
          value,
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          label,
          style: Theme.of(context).textTheme.bodySmall,
        ),
      ],
    );
  }
}
```

### Step 6: Navigation Setup

#### `lib/main.dart`

```dart
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';

import 'providers/content_provider.dart';
import 'providers/language_provider.dart';
import 'providers/favorites_provider.dart';
import 'screens/home_screen.dart';
import 'screens/subjects_screen.dart';
import 'screens/topic_list_screen.dart';
import 'screens/concept_view_screen.dart';
import 'screens/search_screen.dart';
import 'screens/favorites_screen.dart';
import 'screens/profile_screen.dart';
import 'utils/theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ContentProvider()),
        ChangeNotifierProvider(create: (_) => LanguageProvider()),
        ChangeNotifierProvider(create: (_) => FavoritesProvider()),
      ],
      child: MaterialApp.router(
        title: 'Eduverse',
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        routerConfig: _router,
      ),
    );
  }
}

final GoRouter _router = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomeScreen(),
    ),
    GoRoute(
      path: '/subjects',
      builder: (context, state) => const SubjectsScreen(),
    ),
    GoRoute(
      path: '/subjects/:subjectId',
      builder: (context, state) => TopicListScreen(
        subjectId: state.pathParameters['subjectId']!,
      ),
    ),
    GoRoute(
      path: '/subjects/:subjectId/:topicId',
      builder: (context, state) => ConceptViewScreen(
        subjectId: state.pathParameters['subjectId']!,
        topicId: state.pathParameters['topicId']!,
      ),
    ),
    GoRoute(
      path: '/subjects/:subjectId/:topicId/:conceptId',
      builder: (context, state) => ConceptViewScreen(
        subjectId: state.pathParameters['subjectId']!,
        topicId: state.pathParameters['topicId']!,
        conceptId: state.pathParameters['conceptId'],
      ),
    ),
    GoRoute(
      path: '/search',
      builder: (context, state) => const SearchScreen(),
    ),
    GoRoute(
      path: '/favorites',
      builder: (context, state) => const FavoritesScreen(),
    ),
    GoRoute(
      path: '/profile',
      builder: (context, state) => const ProfileScreen(),
    ),
  ],
);
```

## 🎨 UI Components

### Key Widgets to Implement

1. **SubjectCard** - Display subject information with icons
2. **TopicCard** - Show topic details with difficulty and time estimates
3. **ConceptCard** - Present concept information with favorite button
4. **SearchBar** - Custom search input with suggestions
5. **LanguageSelector** - Dropdown for language selection
6. **FavoriteButton** - Toggle favorite status with animations

### Navigation Structure

```
BottomNavigationBar:
├── Home (/)
├── Subjects (/subjects)
├── Search (/search)
├── Favorites (/favorites)
└── Profile (/profile)

Subject Flow:
Home → Subjects → Topics → Concepts
```

## 🔧 Key Features Implementation

### 1. Multilingual Content

- Use Provider for language state management
- Implement caching for translations
- Fallback to English when translation unavailable
- Show translation status indicators

### 2. Favorites System

- Local storage with SharedPreferences
- Sync status indicators
- Organized by subjects
- Quick access from favorites screen

### 3. Search Functionality

- Real-time search with debouncing
- Filter by content type (subjects/topics/concepts)
- Search history and suggestions
- Highlight search terms in results

### 4. Offline Support

- Cache frequently accessed content
- Show offline indicators
- Queue actions for sync when online
- Graceful degradation of features

### 5. User Experience

- Loading states with shimmer effects
- Error boundaries with retry options
- Smooth animations and transitions
- Responsive design for different screen sizes

## 📱 Testing Strategy

1. **Unit Tests**: Test providers and services
2. **Widget Tests**: Test individual components
3. **Integration Tests**: Test complete user flows
4. **Performance Tests**: Test with large datasets

## 🚀 Deployment Considerations

1. **Firebase Configuration**: Set up separate environments
2. **API Keys**: Secure Gemini API key management
3. **App Store Guidelines**: Follow platform-specific requirements
4. **Performance Optimization**: Implement lazy loading and caching

This implementation guide provides a complete roadmap for building the Flutter version of your Eduverse platform. The architecture is scalable, maintainable, and follows Flutter best practices while maintaining feature parity with your React web application.
