import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Headphones, Megaphone, Mic, Pencil, BookOpen, RotateCcw, Star, Sparkles, Trophy, Globe, Cloud, Rocket, Baby, Gamepad2, GraduationCap, Crown, Medal, Layers, Zap, X, Mail, Check, Copy } from 'lucide-react';

// --- STATIC DATA (Moved outside to prevent recreation) ---

const feedbackLib = {
    listening: {
        beginner: {
            1: { can: { en: "listen to simple words", ms: "mendengar perkataan mudah", zh: "听懂简单的单词", th: "ฟังคำศัพท์ง่ายๆ", id: "mendengarkan kata sederhana", vi: "nghe các từ đơn giản", ar: "الاستماع لكلمات بسيطة", tr: "basit kelimeleri dinleme" }, gap: { en: "focusing on the teacher", ms: "fokus kepada guru", zh: "专注于老师", th: "การจดจ่อกับครู", id: "fokus pada guru", vi: "tập trung vào giáo viên", ar: "التركيز مع المعلم", tr: "öğretmene odaklanma" } },
            2: { can: { en: "follow basic commands", ms: "ikut arahan asas", zh: "听懂基本指令", th: "ทำตามคำสั่งพื้นฐาน", id: "mengikuti perintah dasar", vi: "làm theo lệnh cơ bản", ar: "اتباع الأوامر الأساسية", tr: "temel komutları takip etme" }, gap: { en: "understanding questions", ms: "memahami soalan", zh: "理解简单问题", th: "เข้าใจคำถามง่ายๆ", id: "memahami pertanyaan", vi: "hiểu câu hỏi", ar: "فهم الأسئلة", tr: "soruları anlama" } },
            3: { can: { en: "understand key words", ms: "faham kata kunci", zh: "听懂关键词", th: "เข้าใจคำสำคัญ", id: "memahami kata kunci", vi: "hiểu từ khóa", ar: "فهم الكلمات الرئيسية", tr: "anahtar kelimeleri anlama" }, gap: { en: "following instructions", ms: "ikut arahan", zh: "听从指令", th: "การทำตามคำสั่ง", id: "mengikuti instruksi", vi: "làm theo hướng dẫn", ar: "اتباع التعليمات", tr: "talimatları takip etme" } },
            4: { can: { en: "catch familiar words", ms: "tangkap perkataan biasa", zh: "听懂熟悉单词", th: "จับคำที่คุ้นเคย", id: "menangkap kata umum", vi: "nghe được từ quen thuộc", ar: "التقاط الكلمات المألوفة", tr: "tanıdık kelimeleri yakalama" }, gap: { en: "listening to stories", ms: "dengar cerita", zh: "听故事", th: "การฟังนิทาน", id: "mendengarkan cerita", vi: "nghe kể chuyện", ar: "الاستماع للقصص", tr: "hikaye dinleme" } }
        },
        intermediate: {
            1: { can: { en: "understand phrases", ms: "faham frasa", zh: "理解短语", th: "เข้าใจวลี", id: "memahami frasa", vi: "hiểu cụm từ", ar: "فهم العبارات", tr: "ifadeleri anlama" }, gap: { en: "catching main ideas", ms: "tangkap idea utama", zh: "抓住主旨", th: "จับใจความสำคัญ", id: "menangkap ide utama", vi: "nắm bắt ý chính", ar: "التقاط الأفكار الرئيسية", tr: "ana fikirleri yakalama" } },
            2: { can: { en: "follow instructions", ms: "ikut arahan", zh: "听从指令", th: "ทำตามคำสั่ง", id: "mengikuti instruksi", vi: "làm theo hướng dẫn", ar: "اتباع التعليمات", tr: "talimatları takip etme" }, gap: { en: "understanding details", ms: "faham butiran", zh: "理解细节", th: "เข้าใจรายละเอียด", id: "memahami detail", vi: "hiểu chi tiết", ar: "فهم التفاصيل", tr: "ayrıntıları anlama" } },
            3: { can: { en: "understand stories", ms: "faham cerita", zh: "听懂故事", th: "เข้าใจเรื่องราว", id: "memahami cerita", vi: "hiểu câu chuyện", ar: "فهم القصص", tr: "hikayeleri anlama" }, gap: { en: "answering 'why'", ms: "jawab 'kenapa'", zh: "回答'为什么'", th: "ตอบคำถาม 'ทำไม'", id: "menjawab 'mengapa'", vi: "trả lời câu hỏi 'tại sao'", ar: "الإجابة عن 'لماذا'", tr: "'neden' sorularını yanıtlama" } },
            4: { can: { en: "comprehend details", ms: "faham perincian", zh: "理解细节", th: "เข้าใจรายละเอียด", id: "memahami detail", vi: "hiểu chi tiết", ar: "استيعاب التفاصيل", tr: "ayrıntıları kavrama" }, gap: { en: "longer passages", ms: "petikan panjang", zh: "听长段落", th: "บทความยาว", id: "bagian yang lebih panjang", vi: "đoạn văn dài hơn", ar: "النصوص الطويلة", tr: "daha uzun pasajlar" } }
        },
        advanced: {
            1: { can: { en: "understand conversation", ms: "faham perbualan", zh: "理解对话", th: "เข้าใจบทสนทนา", id: "memahami percakapan", vi: "hiểu hội thoại", ar: "فهم المحادثة", tr: "sohbeti anlama" }, gap: { en: "specific details", ms: "butiran khusus", zh: "具体细节", th: "รายละเอียดเฉพาะ", id: "detail spesifik", vi: "chi tiết cụ thể", ar: "تفاصيل محددة", tr: "belirli ayrıntılar" } },
            2: { can: { en: "follow complex stories", ms: "ikut cerita kompleks", zh: "听懂复杂故事", th: "ติดตามเรื่องซับซ้อน", id: "mengikuti cerita kompleks", vi: "theo dõi câu chuyện phức tạp", ar: "متابعة القصص المعقدة", tr: "karmaşık hikayeleri takip etme" }, gap: { en: "fast speech", ms: "cakap laju", zh: "快速语速", th: "การพูดเร็ว", id: "bicara cepat", vi: "tốc độ nói nhanh", ar: "الكلام السريع", tr: "hızlı konuşma" } },
            3: { can: { en: "comprehend discussions", ms: "faham perbincangan", zh: "理解讨论", th: "เข้าใจการอภิปราย", id: "memahami diskusi", vi: "hiểu thảo luận", ar: "استيعاب المناقشات", tr: "tartışmaları kavrama" }, gap: { en: "implicit meaning", ms: "makna tersirat", zh: "隐含意义", th: "ความหมายแฝง", id: "makna tersirat", vi: "ý nghĩa ẩn", ar: "المعنى الضمني", tr: "ima edilen anlam" } },
            4: { can: { en: "understand nuances", ms: "faham nuansa", zh: "理解细微差别", th: "เข้าใจความแตกต่าง", id: "memahami nuansa", vi: "hiểu sắc thái", ar: "فهم الفروق الدقيقة", tr: "nüansları anlama" }, gap: { en: "academic skills", ms: "kemahiran akademik", zh: "学术技能", th: "ทักษะวิชาการ", id: "keterampilan akademik", vi: "kỹ năng học thuật", ar: "المهارات الأكاديمية", tr: "akademik beceriler" } }
        }
    },
    speaking: {
        beginner: {
            1: { can: { en: "repeat words", ms: "ulang perkataan", zh: "重复单词", th: "พูดตามคำศัพท์", id: "mengulang kata", vi: "lặp lại từ", ar: "تكرار الكلمات", tr: "kelimeleri tekrar etme" }, gap: { en: "speaking loudly", ms: "cakap kuat", zh: "大声说话", th: "การพูดเสียงดัง", id: "berbicara lantang", vi: "nói to", ar: "التحدث بصوت عالٍ", tr: "yüksek sesle konuşma" } },
            2: { can: { en: "say simple words", ms: "sebut perkataan mudah", zh: "说简单单词", th: "พูดคำง่ายๆ", id: "mengucapkan kata sederhana", vi: "nói từ đơn giản", ar: "قول كلمات بسيطة", tr: "basit kelimeler söyleme" }, gap: { en: "answering fully", ms: "jawab penuh", zh: "完整回答", th: "ตอบเต็มประโยค", id: "menjawab lengkap", vi: "trả lời đầy đủ", ar: "الإجابة الكاملة", tr: "tam cevap verme" } },
            3: { can: { en: "name objects", ms: "namakan objek", zh: "命名物体", th: "บอกชื่อสิ่งของ", id: "menamai objek", vi: "gọi tên đồ vật", ar: "تسمية الأشياء", tr: "nesneleri isimlendirme" }, gap: { en: "using sentences", ms: "guna ayat", zh: "使用句子", th: "การใช้ประโยค", id: "menggunakan kalimat", vi: "sử dụng câu", ar: "استخدام الجمل", tr: "cümle kurma" } },
            4: { can: { en: "answer questions", ms: "jawab soalan", zh: "回答问题", th: "ตอบคำถาม", id: "menjawab pertanyaan", vi: "trả lời câu hỏi", ar: "الإجابة على الأسئلة", tr: "soruları yanıtlama" }, gap: { en: "asking questions", ms: "tanya soalan", zh: "提出问题", th: "การถามคำถาม", id: "bertanya", vi: "đặt câu hỏi", ar: "طرح الأسئلة", tr: "soru sorma" } }
        },
        intermediate: {
            1: { can: { en: "use simple sentences", ms: "guna ayat mudah", zh: "使用简单句", th: "ใช้ประโยคง่ายๆ", id: "kalimat sederhana", vi: "dùng câu đơn giản", ar: "استخدام جمل بسيطة", tr: "basit cümleler kullanma" }, gap: { en: "fluency", ms: "kefasihan", zh: "流利度", th: "ความคล่องแคล่ว", id: "kelancaran", vi: "lưu loát", ar: "الطلاقة", tr: "akıcılık" } },
            2: { can: { en: "describe pictures", ms: "huraikan gambar", zh: "描述图片", th: "อธิบายภาพ", id: "mendeskripsikan gambar", vi: "mô tả tranh", ar: "وصف الصور", tr: "resimleri tasvir etme" }, gap: { en: "expanding answers", ms: "kembang jawapan", zh: "扩展回答", th: "ขยายคำตอบ", id: "mengembangkan jawaban", vi: "mở rộng câu trả lời", ar: "توسيع الإجابات", tr: "cevapları genişletme" } },
            3: { can: { en: "express needs", ms: "nyatakan keperluan", zh: "表达需求", th: "บอกความต้องการ", id: "menyatakan kebutuhan", vi: "bày tỏ nhu cầu", ar: "التعبير عن الاحتياجات", tr: "ihtiyaçları ifade etme" }, gap: { en: "hesitation", ms: "keraguan", zh: "犹豫", th: "ความลังเล", id: "keragu-raguan", vi: "sự ngập ngừng", ar: "التردد", tr: "tereddüt" } },
            4: { can: { en: "tell stories", ms: "bercerita", zh: "讲故事", th: "เล่าเรื่อง", id: "bercerita", vi: "kể chuyện", ar: "سرد القصص", tr: "hikaye anlatma" }, gap: { en: "descriptive words", ms: "perkataan deskriptif", zh: "描述性词汇", th: "คำขยายความ", id: "kata deskriptif", vi: "từ ngữ miêu tả", ar: "الكلمات الوصفية", tr: "betimleyici kelimeler" } }
        },
        advanced: {
            1: { can: { en: "discuss topics", ms: "bincang topik", zh: "讨论话题", th: "อภิปรายหัวข้อ", id: "mendiskusikan topik", vi: "thảo luận chủ đề", ar: "مناقشة المواضيع", tr: "konuları tartışma" }, gap: { en: "elaborating", ms: "menghuraikan", zh: "详细说明", th: "การขยายความ", id: "menjelaskan", vi: "diễn giải", ar: "التفصيل", tr: "ayrıntılı açıklama" } },
            2: { can: { en: "express opinions", ms: "beri pendapat", zh: "表达观点", th: "แสดงความคิดเห็น", id: "menyatakan pendapat", vi: "bày tỏ ý kiến", ar: "التعبير عن الآراء", tr: "fikir belirtme" }, gap: { en: "complex sentences", ms: "ayat kompleks", zh: "复杂句子", th: "ประโยคซับซ้อน", id: "kalimat kompleks", vi: "câu phức", ar: "الجمل المعقدة", tr: "karmaşık cümleler" } },
            3: { can: { en: "debate", ms: "debat", zh: "辩论", th: "โต้วาที", id: "debat", vi: "tranh luận", ar: "المناظرة", tr: "tartışma" }, gap: { en: "idioms", ms: "simpulan bahasa", zh: "习语", th: "สำนวน", id: "idiom", vi: "thành ngữ", ar: "المصطلحات", tr: "deyimler" } },
            4: { can: { en: "speak fluently", ms: "cakap fasih", zh: "流利说话", th: "พูดคล่อง", id: "bicara lancar", vi: "nói lưu loát", ar: "تحدث بطلاقة", tr: "akıcı konuşma" }, gap: { en: "varied vocab", ms: "kosa kata pelbagai", zh: "丰富词汇", th: "คำศัพท์หลากหลาย", id: "kosakata variatif", vi: "từ vựng đa dạng", ar: "مفردات متنوعة", tr: "çeşitli kelime dağarcığı" } }
        }
    },
    pronunciation: {
        beginner: {
            1: { can: { en: "mimic sounds", ms: "tiru bunyi", zh: "模仿声音", th: "เลียนเสียง", id: "meniru suara", vi: "bắt chước âm thanh", ar: "تقليد الأصوات", tr: "sesleri taklit etme" }, gap: { en: "ending sounds", ms: "bunyi akhir", zh: "尾音", th: "เสียงท้ายคำ", id: "bunyi akhir", vi: "âm cuối", ar: "الأصوات النهائية", tr: "bitiş sesleri" } },
            2: { can: { en: "say vowels", ms: "sebut vokal", zh: "发元音", th: "ออกเสียงสระ", id: "mengucapkan vokal", vi: "phát âm nguyên âm", ar: "نطق الحروف المتحركة", tr: "ünlüleri söyleme" }, gap: { en: "blending", ms: "gabungan bunyi", zh: "拼读", th: "การผสมเสียง", id: "penggabungan", vi: "ghép vần", ar: "المزج", tr: "sesleri birleştirme" } },
            3: { can: { en: "speak clearly", ms: "cakap jelas", zh: "说话清晰", th: "พูดชัดเจน", id: "bicara jelas", vi: "nói rõ ràng", ar: "تحدث بوضوح", tr: "net konuşma" }, gap: { en: "intonation", ms: "intonasi", zh: "语调", th: "น้ำเสียง", id: "intonasi", vi: "ngữ điệu", ar: "نبرة الصوت", tr: "tonlama" } },
            4: { can: { en: "natural rhythm", ms: "ritma semula jadi", zh: "自然节奏", th: "จังหวะธรรมชาติ", id: "ritme alami", vi: "nhịp điệu tự nhiên", ar: "الإيقاع الطبيعي", tr: "doğal ritim" }, gap: { en: "sentence flow", ms: "aliran ayat", zh: "句子流畅度", th: "การไหลของประโยค", id: "aliran kalimat", vi: "độ trôi chảy", ar: "تدفق الجمل", tr: "cümle akışı" } }
        },
        intermediate: {
            1: { can: { en: "be understood", ms: "difahami", zh: "被理解", th: "สื่อสารเข้าใจ", id: "dimengerti", vi: "được hiểu", ar: "أن يُفهم", tr: "anlaşılma" }, gap: { en: "word stress", ms: "tekanan kata", zh: "单词重音", th: "การเน้นคำ", id: "penekanan kata", vi: "trọng âm từ", ar: "تشديد الكلمات", tr: "kelime vurgusu" } },
            2: { can: { en: "say long words", ms: "sebut perkataan panjang", zh: "说长单词", th: "พูดคำยาว", id: "kata panjang", vi: "nói từ dài", ar: "نطق الكلمات الطويلة", tr: "uzun kelimeler söyleme" }, gap: { en: "rhythm", ms: "ritma", zh: "节奏", th: "จังหวะ", id: "ritme", vi: "nhịp điệu", ar: "الإيقاع", tr: "ritim" } },
            3: { can: { en: "speak naturally", ms: "cakap bersahaja", zh: "自然说话", th: "พูดเป็นธรรมชาติ", id: "bicara alami", vi: "nói tự nhiên", ar: "تحدث بشكل طبيعي", tr: "doğal konuşma" }, gap: { en: "linking words", ms: "sambung perkataan", zh: "连读", th: "การเชื่อมคำ", id: "menghubungkan kata", vi: "nối từ", ar: "ربط الكلمات", tr: "kelimeleri bağlama" } },
            4: { can: { en: "sound confident", ms: "bunyi yakin", zh: "听起来自信", th: "เสียงมั่นใจ", id: "terdengar percaya diri", vi: "nghe tự tin", ar: "صوت واثق", tr: "kendinden emin duyulma" }, gap: { en: "intonation", ms: "intonasi", zh: "语调", th: "น้ำเสียง", id: "intonasi", vi: "ngữ điệu", ar: "نبرة الصوت", tr: "tonlama" } }
        },
        advanced: {
            1: { can: { en: "clear accent", ms: "loghat jelas", zh: "口音清晰", th: "สำเนียงชัดเจน", id: "aksen jelas", vi: "giọng rõ ràng", ar: "لهجة واضحة", tr: "net aksan" }, gap: { en: "stress", ms: "tekanan", zh: "重音", th: "การเน้นเสียง", id: "penekanan", vi: "trọng âm", ar: "التشديد", tr: "vurgu" } },
            2: { can: { en: "natural tone", ms: "nada semula jadi", zh: "自然语调", th: "โทนเสียงธรรมชาติ", id: "nada alami", vi: "tông giọng tự nhiên", ar: "نبرة طبيعية", tr: "doğal ton" }, gap: { en: "clarity", ms: "kejelasan", zh: "清晰度", th: "ความชัดเจน", id: "kejelasan", vi: "độ rõ", ar: "الوضوح", tr: "netlik" } },
            3: { can: { en: "hard sounds", ms: "bunyi sukar", zh: "难发音", th: "เสียงยาก", id: "bunyi sulit", vi: "âm khó", ar: "الأصوات الصعبة", tr: "zor sesler" }, gap: { en: "emotion", ms: "emosi", zh: "情感", th: "อารมณ์", id: "emosi", vi: "cảm xúc", ar: "العاطفة", tr: "duygu" } },
            4: { can: { en: "flawless", ms: "sempurna", zh: "完美", th: "ไร้ที่ติ", id: "sempurna", vi: "hoàn hảo", ar: "لا تشوبه شائبة", tr: "kusursuz" }, gap: { en: "nuance", ms: "nuansa", zh: "细微差别", th: "ความแตกต่างเล็กน้อย", id: "nuansa", vi: "sắc thái", ar: "فروق دقيقة", tr: "nüans" } }
        }
    },
    grammar: {
        beginner: {
            1: { can: { en: "use single words", ms: "guna satu perkataan", zh: "使用单词", th: "ใช้คำเดียว", id: "kata tunggal", vi: "dùng từ đơn", ar: "استخدام كلمات مفردة", tr: "tek kelime kullanma" }, gap: { en: "verbs", ms: "kata kerja", zh: "动词", th: "คำกริยา", id: "kata kerja", vi: "động từ", ar: "الأفعال", tr: "fiiller" } },
            2: { can: { en: "use basic verbs", ms: "guna kata kerja asas", zh: "使用基本动词", th: "ใช้กริยาพื้นฐาน", id: "kata kerja dasar", vi: "động từ cơ bản", ar: "أفعال أساسية", tr: "temel fiiller" }, gap: { en: "plurals", ms: "jamak", zh: "复数", th: "พหูพจน์", id: "jamak", vi: "số nhiều", ar: "الجمع", tr: "çoğul" } },
            3: { can: { en: "make sentences", ms: "bina ayat", zh: "造句", th: "แต่งประโยค", id: "membuat kalimat", vi: "đặt câu", ar: "تكوين جمل", tr: "cümle kurma" }, gap: { en: "pronouns", ms: "kata ganti nama", zh: "代词", th: "คำสรรพนาม", id: "kata ganti", vi: "đại từ", ar: "الضمائر", tr: "zamirler" } },
            4: { can: { en: "present tense", ms: "masa kini", zh: "现在时", th: "ปัจจุบันกาล", id: "waktu sekarang", vi: "thì hiện tại", ar: "الزمن الحاضر", tr: "geniş zaman" }, gap: { en: "past tense", ms: "masa lampau", zh: "过去时", th: "อดีตกาล", id: "masa lampau", vi: "thì quá khứ", ar: "الزمن الماضي", tr: "geçmiş zaman" } }
        },
        intermediate: {
            1: { can: { en: "correct sentences", ms: "ayat betul", zh: "正确句子", th: "ประโยคถูกต้อง", id: "kalimat benar", vi: "câu đúng", ar: "جمل صحيحة", tr: "doğru cümleler" }, gap: { en: "tenses", ms: "kala", zh: "时态", th: "กาล", id: "tenses", vi: "thì", ar: "الأزمنة", tr: "zamanlar" } },
            2: { can: { en: "past tense", ms: "masa lampau", zh: "过去时", th: "อดีตกาล", id: "masa lampau", vi: "thì quá khứ", ar: "الزمن الماضي", tr: "geçmiş zaman" }, gap: { en: "future tense", ms: "masa depan", zh: "将来时", th: "อนาคตกาล", id: "masa depan", vi: "thì tương lai", ar: "الزمن المستقبل", tr: "gelecek zaman" } },
            3: { can: { en: "connect ideas", ms: "sambung idea", zh: "连接观点", th: "เชื่อมโยงความคิด", id: "menghubungkan ide", vi: "kết nối ý tưởng", ar: "ربط الأفكار", tr: "fikirleri bağlama" }, gap: { en: "prepositions", ms: "kata sendi", zh: "介词", th: "คำบุพบท", id: "preposisi", vi: "giới từ", ar: "حروف الجر", tr: "edatlar" } },
            4: { can: { en: "varied tenses", ms: "pelbagai kala", zh: "多种时态", th: "หลากหลายกาล", id: "berbagai tenses", vi: "đa dạng thì", ar: "أزمنة متنوعة", tr: "çeşitli zamanlar" }, gap: { en: "complex sentences", ms: "ayat kompleks", zh: "复杂句", th: "ประโยคซับซ้อน", id: "kalimat kompleks", vi: "câu phức", ar: "جمل معقدة", tr: "karmaşık cümleler" } }
        },
        advanced: {
            1: { can: { en: "complex sentences", ms: "ayat kompleks", zh: "复杂句", th: "ประโยคซับซ้อน", id: "kalimat kompleks", vi: "câu phức", ar: "جمل معقدة", tr: "karmaşık cümleler" }, gap: { en: "conditions", ms: "syarat", zh: "条件句", th: "เงื่อนไข", id: "pengandaian", vi: "câu điều kiện", ar: "الشروط", tr: "koşullar" } },
            2: { can: { en: "perfect tenses", ms: "kala sempurna", zh: "完成时", th: "สมบูรณ์กาล", id: "perfect tenses", vi: "thì hoàn thành", ar: "الأزمنة التامة", tr: "bitmiş zamanlar" }, gap: { en: "passive voice", ms: "ayat pasif", zh: "被动语态", th: "กรรมวาจก", id: "kalimat pasif", vi: "bị động", ar: "المبني للمجهول", tr: "edilgen çatı" } },
            3: { can: { en: "academic grammar", ms: "tatabahasa akademik", zh: "学术语法", th: "ไวยากรณ์วิชาการ", id: "tata bahasa akademik", vi: "ngữ pháp học thuật", ar: "قواعد أكاديمية", tr: "akademik dilbilgisi" }, gap: { en: "subtle rules", ms: "peraturan halus", zh: "细微规则", th: "กฎเกณฑ์ละเอียด", id: "aturan halus", vi: "quy tắc nhỏ", ar: "قواعد دقيقة", tr: "ince kurallar" } },
            4: { can: { en: "mastery", ms: "penguasaan", zh: "精通", th: "ความเชี่ยวชาญ", id: "penguasaan", vi: "thành thạo", ar: "الإتقان", tr: "ustalık" }, gap: { en: "style", ms: "gaya", zh: "风格", th: "สไตล์", id: "gaya", vi: "phong cách", ar: "الأسلوب", tr: "stil" } }
        }
    },
    vocabulary: {
        beginner: {
            1: { can: { en: "name objects", ms: "namakan objek", zh: "命名物体", th: "เรียกชื่อสิ่งของ", id: "menamai objek", vi: "gọi tên vật", ar: "تسمية الأشياء", tr: "nesneleri isimlendirme" }, gap: { en: "action words", ms: "kata kerja", zh: "动作词", th: "คำกริยา", id: "kata kerja", vi: "từ chỉ hành động", ar: "كلمات العمل", tr: "eylem kelimeleri" } },
            2: { can: { en: "colors & numbers", ms: "warna & nombor", zh: "颜色和数字", th: "สีและตัวเลข", id: "warna & angka", vi: "màu sắc & số", ar: "الألوان والأرقام", tr: "renkler ve sayılar" }, gap: { en: "feelings", ms: "perasaan", zh: "情感", th: "ความรู้สึก", id: "perasaan", vi: "cảm xúc", ar: "المشاعر", tr: "duygular" } },
            3: { can: { en: "daily words", ms: "perkataan harian", zh: "日常词汇", th: "คำศัพท์ประจำวัน", id: "kata sehari-hari", vi: "từ vựng hàng ngày", ar: "كلمات يومية", tr: "günlük kelimeler" }, gap: { en: "description", ms: "huraian", zh: "描述", th: "การบรรยาย", id: "deskripsi", vi: "miêu tả", ar: "الوصف", tr: "betimleme" } },
            4: { can: { en: "good range", ms: "julat baik", zh: "词汇量不错", th: "คลังคำศัพท์ดี", id: "jangkauan baik", vi: "vốn từ tốt", ar: "نطاق جيد", tr: "iyi kapsam" }, gap: { en: "new topics", ms: "topik baharu", zh: "新话题", th: "หัวข้อใหม่", id: "topik baru", vi: "chủ đề mới", ar: "مواضيع جديدة", tr: "yeni konular" } }
        },
        intermediate: {
            1: { can: { en: "describe life", ms: "huraikan kehidupan", zh: "描述生活", th: "บรรยายชีวิต", id: "deskripsi hidup", vi: "mô tả cuộc sống", ar: "وصف الحياة", tr: "hayatı tasvir etme" }, gap: { en: "synonyms", ms: "sinonim", zh: "同义词", th: "คำพ้องความหมาย", id: "sinonim", vi: "từ đồng nghĩa", ar: "المترادفات", tr: "eş anlamlılar" } },
            2: { can: { en: "adjectives", ms: "kata sifat", zh: "形容词", th: "คำคุณศัพท์", id: "kata sifat", vi: "tính từ", ar: "الصفوف", tr: "sıfatlar" }, gap: { en: "adverbs", ms: "kata keterangan", zh: "副词", th: "กริยาวิเศษณ์", id: "kata keterangan", vi: "trạng từ", ar: "الظروف", tr: "zarflar" } },
            3: { can: { en: "hobbies", ms: "hobi", zh: "爱好", th: "งานอดิเรก", id: "hobi", vi: "sở thích", ar: "الهوايات", tr: "hobiler" }, gap: { en: "details", ms: "perincian", zh: "细节", th: "รายละเอียด", id: "detail", vi: "chi tiết", ar: "التفاصيل", tr: "ayrıntılar" } },
            4: { can: { en: "rich vocab", ms: "kosa kata kaya", zh: "丰富词汇", th: "ศัพท์หรู", id: "kosakata kaya", vi: "từ vựng phong phú", ar: "مفردات غنية", tr: "zengin kelime" }, gap: { en: "idioms", ms: "simpulan bahasa", zh: "习语", th: "สำนวน", id: "idiom", vi: "thành ngữ", ar: "المصطلحات", tr: "deyimler" } }
        },
        advanced: {
            1: { can: { en: "abstract ideas", ms: "idea abstrak", zh: "抽象观点", th: "ความคิดนามธรรม", id: "ide abstrak", vi: "ý tưởng trừu tượng", ar: "أفكار مجردة", tr: "soyut fikirler" }, gap: { en: "formal words", ms: "perkataan formal", zh: "正式词汇", th: "คำศัพท์ทางการ", id: "kata formal", vi: "từ trang trọng", ar: "كلمات رسمية", tr: "resmi kelimeler" } },
            2: { can: { en: "topic words", ms: "perkataan topik", zh: "主题词汇", th: "คำศัพท์เฉพาะ", id: "kata topik", vi: "từ chủ đề", ar: "كلمات الموضوع", tr: "konu kelimeleri" }, gap: { en: "phrasal verbs", ms: "frasa kerja", zh: "短语动词", th: "กริยาวลี", id: "frasa kerja", vi: "cụm động từ", ar: "الأفعال المركبة", tr: "deyimsel fiiller" } },
            3: { can: { en: "sophisticated", ms: "canggih", zh: "高级", th: "ซับซ้อน", id: "canggih", vi: "tinh tế", ar: "متطور", tr: "gelişmiş" }, gap: { en: "nuance", ms: "nuansa", zh: "细微差别", th: "ความแตกต่าง", id: "nuansa", vi: "sắc thái", ar: "فروق دقيقة", tr: "nüans" } },
            4: { can: { en: "precise", ms: "tepat", zh: "精准", th: "แม่นยำ", id: "tepat", vi: "chính xác", ar: "دقيق", tr: "kesin" }, gap: { en: "literary", ms: "sastera", zh: "文学", th: "วรรณกรรม", id: "sastra", vi: "văn học", ar: "أدبي", tr: "edebi" } }
        }
    }
};

const connectors = { en: " and ", ms: " dan ", zh: "和", th: " และ ", id: " dan ", vi: " và ", ar: " و ", tr: " ve " };

const reportTranslations = {
    en: {
        opening: { toddler: "{sub} did a wonderful job today! It was so much fun learning together.", teen: "{sub} showed excellent focus and effort in today's session.", child: "{sub} put in great effort today!" },
        level: {
            beginner: { toddler: "Currently, {sub} is in our beginner level (Level {level}). We use a gentle, step-by-step approach to help {obj} build a strong foundation and get ready for the next steps.", teen: "Currently, {sub} is in the beginner phase (Level {level}). We follow a structured program to ensure {sub} grasps the core mechanics of the language before moving forward.", child: "The student is currently in our beginner level (Level {level}), where we follow a step-by-step program designed to build a strong foundation and gradually move to the next level." },
            intermediate: { toddler: "{sub} is growing fast in our intermediate level (Level {level})! We are using fun stories to help {obj} use more words and understand longer sentences.", teen: "{sub} is at an intermediate level (Level {level}). We are now focusing on expanding conversation skills and vocabulary to allow for more natural expression.", child: "The student is currently in our intermediate level (Level {level}), where we focus on connecting ideas and expanding vocabulary to help {obj} communicate more confidently." },
            advanced: { toddler: "Wow! {sub} is flying high in our advanced level (Level {level}). We are playing complex games to help {obj} speak naturally!", teen: "{sub} is performing at an advanced level (Level {level}). Our sessions are now dedicated to refining nuance, tone, and complex argumentation.", child: "The student is currently in our advanced level (Level {level}), where we challenge {obj} with complex stories and discussions to master fluency." }
        },
        action: "With consistent weekly practice, we can strengthen {poss} {w1} and {w2} and help {obj} move confidently to the next level.",
        closing: { toddler: "I look forward to seeing {obj} in class again! Regular, fun play-based lessons will help build on {poss} strengths and lead to steady improvement.", teen: "I look forward to having {obj} in class again. Regular lessons are crucial to build on current strengths and will lead to steady improvement.", child: "I look forward to having your child in class again. Regular lessons will help build on current strengths and lead to steady improvement." }
    },
    ms: {
        opening: { toddler: "Anak anda melakukan kerja yang hebat hari ini! Seronok sangat belajar bersama.", teen: "Pelajar menunjukkan fokus dan usaha yang cemerlang dalam sesi hari ini.", child: "Anak anda berusaha dengan gigih hari ini!" },
        level: {
            beginner: { toddler: "Pada masa ini, dia berada di tahap permulaan kami (Tahap {level}). Kami menggunakan pendekatan bertahap yang lembut untuk membantunya membina asas yang kukuh dan bersedia untuk langkah seterusnya.", teen: "Pada masa ini, dia berada di fasa permulaan (Tahap {level}). Kami mengikuti program berstruktur untuk memastikan dia memahami mekanik asas bahasa sebelum bergerak ke hadapan.", child: "Pelajar kini berada di tahap permulaan kami (Tahap {level}), di mana kami mengikuti program bertahap yang direka untuk membina asas yang kukuh dan bergerak ke tahap seterusnya secara beransur-ansur." },
            intermediate: { toddler: "Dia berkembang pesat di tahap pertengahan kami (Tahap {level})! Kami menggunakan cerita yang menyeronokkan untuk membantunya menggunakan lebih banyak perkataan dan memahami ayat yang lebih panjang.", teen: "Dia berada di tahap pertengahan (Tahap {level}). Kami kini memberi tumpuan untuk mengembangkan kemahiran perbualan dan kosa kata untuk membolehkan ekspresi yang lebih semula jadi.", child: "Pelajar kini berada di tahap pertengahan kami (Tahap {level}), di mana kami memberi tumpuan untuk menghubungkan idea dan mengembangkan kosa kata untuk membantunya berkomunikasi dengan lebih yakin." },
            advanced: { toddler: "Wah! Dia semakin hebat di tahap lanjutan kami (Tahap {level}). Kami bermain permainan kompleks untuk membantunya bercakap secara semula jadi!", teen: "Dia menunjukkan prestasi di tahap lanjutan (Tahap {level}). Sesi kami kini didedikasikan untuk memperhalusi nuansa, nada, dan penghujahan yang kompleks.", child: "Pelajar kini berada di tahap lanjutan kami (Tahap {level}), di mana kami mencabarnya dengan cerita dan perbincangan yang kompleks untuk menguasai kefasihan." }
        },
        action: "Dengan latihan mingguan yang konsisten, kita dapat memperkukuhkan {w1} dan {w2} {poss} serta membantu {obj} melangkah dengan yakin ke tahap seterusnya.",
        closing: { toddler: "Saya tidak sabar untuk melihatnya di kelas lagi! Pembelajaran berasaskan bermain yang menyeronokkan akan membantu membina kekuatannya dan membawa kepada peningkatan yang stabil.", teen: "Saya berharap dapat melihatnya di kelas lagi. Pelajaran tetap adalah penting untuk membina kekuatan semasa dan akan membawa kepada peningkatan yang stabil.", child: "Saya berharap dapat melihat anak anda di kelas lagi. Pelajaran tetap akan membantu membina kekuatan semasa dan membawa kepada peningkatan yang stabil." }
    },
    zh: {
        opening: { toddler: "您的孩子今天表现非常棒！我们一起学习非常开心。", teen: "学生在今天的课程中表现出极佳的专注力和努力。", child: "您的孩子今天非常努力！" },
        level: {
            beginner: { toddler: "目前，{sub}处于我们的初学者级别（{level}级）。我们采用循序渐进的方法帮助{obj}打下坚实的基础，为接下来的学习做好准备。", teen: "目前，{sub}处于初学者阶段（{level}级）。我们遵循结构化的课程，确保{sub}在继续学习之前掌握语言的核心机制。", child: "学生目前处于我们的初学者级别（{level}级），我们遵循循序渐进的课程设计，旨在建立坚实的基础并逐步进入下一个级别。" },
            intermediate: { toddler: "{sub}在我们的中级级别（{level}级）进步神速！我们正在使用有趣的故事来帮助{obj}使用更多词汇并理解更长的句子。", teen: "{sub}目前处于中级水平（{level}级）。我们现在的重点是扩展会话技巧和词汇量，以实现更自然的表达。", child: "学生目前处于我们的中级级别（{level}级），我们专注于连接观点和扩展词汇量，以帮助{obj}更自信地交流。" },
            advanced: { toddler: "哇！{sub}在我们的高级级别（{level}级）表现出色。我们正在玩复杂的游戏来帮助{obj}自然地说话！", teen: "{sub}目前处于高级水平（{level}级）。我们的课程现在致力于完善细微差别、语气和复杂的论证。", child: "学生目前处于我们的高级级别（{level}级），我们通过复杂的故事和讨论来挑战{obj}，以掌握流利度。" }
        },
        action: "通过每周坚持不懈的练习，我们可以加强{poss}{w1}和{w2}，帮助{obj}自信地迈向下一个阶段。",
        closing: { toddler: "我期待再次在课堂上见到{obj}！定期、有趣的游戏化课程将有助于巩固{poss}强项并带来持续的进步。", teen: "我期待再次在课堂上见到{obj}。定期的课程对于巩固现有强项至关重要，并将带来稳定的进步。", child: "我期待再次在课堂上见到您的孩子。定期的课程将有助于巩固现有强项并带来稳定的进步。" }
    },
    th: {
        opening: { toddler: "น้องทำได้ดีมากในวันนี้! สนุกมากที่ได้เรียนรู้ด้วยกัน", teen: "นักเรียนแสดงสมาธิและความพยายามอย่างยอดเยี่ยมในวันนี้", child: "น้องมีความพยายามอย่างมากในวันนี้!" },
        level: {
            beginner: { toddler: "ขณะนี้น้องอยู่ในระดับเริ่มต้น (ระดับ {level}) เราใช้วิธีการแบบค่อยเป็นค่อยไปอย่างนุ่มนวลเพื่อช่วยให้น้องสร้างพื้นฐานที่แข็งแกร่งและเตรียมพร้อมสำหรับขั้นตอนต่อไป", teen: "ขณะนี้นักเรียนอยู่ในระยะเริ่มต้น (ระดับ {level}) เราปฏิบัติตามโปรแกรมที่มีโครงสร้างเพื่อให้แน่ใจว่านักเรียนเข้าใจกลไกหลักของภาษาก่อนที่จะก้าวไปข้างหน้า", child: "ขณะนี้นักเรียนอยู่ในระดับเริ่มต้น (ระดับ {level}) ซึ่งเราปฏิบัติตามโปรแกรมแบบค่อยเป็นค่อยไปที่ออกแบบมาเพื่อสร้างพื้นฐานที่แข็งแกร่งและค่อยๆ ก้าวไปสู่ระดับต่อไป" },
            intermediate: { toddler: "น้องกำลังเติบโตอย่างรวดเร็วในระดับกลาง (ระดับ {level})! เรากำลังใช้เรื่องราวสนุกๆ เพื่อช่วยให้น้องใช้คำศัพท์มากขึ้นและเข้าใจประโยคที่ยาวขึ้น", teen: "นักเรียนอยู่ในระดับกลาง (ระดับ {level}) ขณะนี้เรากำลังเน้นไปที่การขยายทักษะการสนทนาและคำศัพท์เพื่อให้สามารถแสดงออกได้อย่างเป็นธรรมชาติมากขึ้น", child: "ขณะนี้นักเรียนอยู่ในระดับกลาง (ระดับ {level}) ซึ่งเราเน้นไปที่การเชื่อมโยงความคิดและขยายคำศัพท์เพื่อช่วยให้น้องสื่อสารได้อย่างมั่นใจมากขึ้น" },
            advanced: { toddler: "ว้าว! น้องกำลังไปได้สวยในระดับสูง (ระดับ {level}) เรากำลังเล่นเกมที่ซับซ้อนเพื่อช่วยให้น้องพูดได้อย่างเป็นธรรมชาติ!", teen: "นักเรียนกำลังแสดงผลงานในระดับสูง (ระดับ {level}) เซสชันของเราตอนนี้อุทิศให้กับการปรับปรุงความแตกต่างเล็กน้อย น้ำเสียง และการโต้แย้งที่ซับซ้อน", child: "ขณะนี้นักเรียนอยู่ในระดับสูง (ระดับ {level}) ซึ่งเราท้าทายน้องด้วยเรื่องราวและการอภิปรายที่ซับซ้อนเพื่อความคล่องแคล่ว" }
        },
        action: "ด้วยการฝึกฝนทุกสัปดาห์อย่างสม่ำเสมอ เราจะสามารถพัฒนา{w1}และ{w2}ของ{poss} และช่วยให้{obj}ก้าวไปสู่ระดับต่อไปได้อย่างมั่นใจ",
        closing: { toddler: "ฉันรอคอยที่จะได้พบน้องในชั้นเรียนอีกครั้ง! บทเรียนที่สนุกสนานและเน้นการเล่นอย่างสม่ำเสมอจะช่วยสร้างจุดแข็งและนำไปสู่การพัฒนาที่มั่นคง", teen: "ฉันรอคอยที่จะได้พบนักเรียนในชั้นเรียนอีกครั้ง บทเรียนที่สม่ำเสมอมีความสำคัญต่อการสร้างจุดแข็งในปัจจุบันและจะนำไปสู่การพัฒนาที่มั่นคง", child: "ฉันรอคอยที่จะได้พบลูกของคุณในชั้นเรียนอีกครั้ง บทเรียนที่สม่ำเสมอจะช่วยสร้างจุดแข็งในปัจจุบันและนำไปสู่การพัฒนาที่มั่นคง" }
    },
    id: {
        opening: { toddler: "Anak Anda melakukan pekerjaan yang luar biasa hari ini! Sangat menyenangkan belajar bersama.", teen: "Siswa menunjukkan fokus dan usaha yang sangat baik dalam sesi hari ini.", child: "Anak Anda berusaha keras hari ini!" },
        level: {
            beginner: { toddler: "Saat ini, dia berada di tingkat pemula kami (Tingkat {level}). Kami menggunakan pendekatan bertahap yang lembut untuk membantunya membangun fondasi yang kuat dan bersiap untuk langkah selanjutnya.", teen: "Saat ini, dia berada di fase pemula (Tingkat {level}). Kami mengikuti program terstruktur untuk memastikan dia memahami mekanisme inti bahasa sebelum melangkah maju.", child: "Siswa saat ini berada di tingkat pemula kami (Tingkat {level}), di mana kami mengikuti program bertahap yang dirancang untuk membangun fondasi yang kuat dan secara bertahap pindah ke tingkat berikutnya." },
            intermediate: { toddler: "Dia berkembang pesat di tingkat menengah kami (Tingkat {level})! Kami menggunakan cerita seru untuk membantunya menggunakan lebih banyak kata dan memahami kalimat yang lebih panjang.", teen: "Dia berada di tingkat menengah (Tingkat {level}). Kami sekarang berfokus pada perluasan keterampilan percakapan dan kosa kata untuk memungkinkan ekspresi yang lebih alami.", child: "Siswa saat ini berada di tingkat menengah kami (Tingkat {level}), di mana kami berfokus pada menghubungkan ide dan memperluas kosa kata untuk membantunya berkomunikasi dengan lebih percaya diri." },
            advanced: { toddler: "Wow! Dia semakin hebat di tingkat lanjutan kami (Tingkat {level}). Kami memainkan permainan kompleks untuk membantunya berbicara secara alami!", teen: "Dia berkinerja di tingkat lanjutan (Tingkat {level}). Sesi kami sekarang didedikasikan untuk menyempurnakan nuansa, nada, dan argumentasi yang kompleks.", child: "Siswa saat ini berada di tingkat lanjutan kami (Tingkat {level}), di mana kami menantangnya dengan cerita dan diskusi yang kompleks untuk menguasai kefasihan." }
        },
        action: "Dengan latihan mingguan yang konsisten, kita dapat memperkuat {w1} dan {w2} {poss} dan membantu {obj} melangkah dengan percaya diri ke tingkat berikutnya.",
        closing: { toddler: "Saya berharap dapat melihatnya di kelas lagi! Pelajaran berbasis permainan yang menyenangkan dan teratur akan membantu membangun kekuatannya dan mengarah pada peningkatan yang stabil.", teen: "Saya berharap dapat melihatnya di kelas lagi. Pelajaran teratur sangat penting untuk membangun kekuatan saat ini dan akan mengarah pada peningkatan yang stabil.", child: "Saya berharap dapat melihat anak Anda di kelas lagi. Pelajaran teratur akan membantu membangun kekuatan saat ini dan mengarah pada peningkatan yang stabil." }
    },
    vi: {
        opening: { toddler: "Bé đã làm rất tốt hôm nay! Thật vui khi được học cùng nhau.", teen: "Em đã thể hiện sự tập trung và nỗ lực tuyệt vời trong buổi học hôm nay.", child: "Con đã rất cố gắng hôm nay!" },
        level: {
            beginner: { toddler: "Hiện tại, bé đang ở cấp độ mới bắt đầu (Cấp độ {level}). Chúng tôi sử dụng phương pháp nhẹ nhàng, từng bước để giúp bé xây dựng nền tảng vững chắc và sẵn sàng cho các bước tiếp theo.", teen: "Hiện tại, em đang ở giai đoạn mới bắt đầu (Cấp độ {level}). Chúng tôi tuân theo một chương trình có cấu trúc để đảm bảo em nắm bắt được các cơ chế cốt lõi của ngôn ngữ trước khi tiến lên.", child: "Học sinh hiện đang ở cấp độ mới bắt đầu (Cấp độ {level}), nơi chúng tôi tuân theo một chương trình từng bước được thiết kế để xây dựng nền tảng vững chắc và dần dần chuyển sang cấp độ tiếp theo." },
            intermediate: { toddler: "Bé đang tiến bộ nhanh chóng ở cấp độ trung cấp (Cấp độ {level})! Chúng tôi đang sử dụng những câu chuyện vui nhộn để giúp bé sử dụng nhiều từ hơn và hiểu các câu dài hơn.", teen: "Em đang ở cấp độ trung cấp (Cấp độ {level}). Hiện tại, chúng tôi đang tập trung vào việc mở rộng kỹ năng hội thoại và từ vựng để cho phép diễn đạt tự nhiên hơn.", child: "Học sinh hiện đang ở cấp độ trung cấp (Cấp độ {level}), nơi chúng tôi tập trung vào việc kết nối các ý tưởng và mở rộng từ vựng để giúp em giao tiếp tự tin hơn." },
            advanced: { toddler: "Chà! Bé đang bay cao ở cấp độ cao cấp (Cấp độ {level}). Chúng tôi đang chơi các trò chơi phức tạp để giúp bé nói chuyện tự nhiên!", teen: "Em đang thể hiện ở cấp độ cao cấp (Cấp độ {level}). Các buổi học của chúng tôi hiện dành riêng để tinh chỉnh sắc thái, giọng điệu và lập luận phức tạp.", child: "Học sinh hiện đang ở cấp độ cao cấp (Cấp độ {level}), nơi chúng tôi thử thách em với những câu chuyện và thảo luận phức tạp để làm chủ sự lưu loát." }
        },
        action: "Với việc luyện tập hàng tuần đều đặn, chúng ta có thể củng cố {w1} và {w2} của {poss} và giúp {obj} tự tự bước lên cấp độ tiếp theo.",
        closing: { toddler: "Tôi rất mong được gặp lại bé trong lớp! Các bài học vui nhộn, dựa trên trò chơi thường xuyên sẽ giúp phát huy thế mạnh của bé và dẫn đến sự tiến bộ ổn định.", teen: "Tôi rất mong được gặp lại em trong lớp. Các bài học thường xuyên là rất quan trọng để xây dựng dựa trên những điểm mạnh hiện tại và sẽ dẫn đến sự tiến bộ ổn định.", child: "Tôi rất mong được gặp lại con bạn trong lớp. Các bài học thường xuyên sẽ giúp xây dựng dựa trên những điểm mạnh hiện tại và dẫn đến sự tiến bộ ổn định." }
    },
    ar: {
        opening: { toddler: "قام طفلك بعمل رائع اليوم! كان التعلم معًا ممتعًا للغاية.", teen: "أظهر الطالب تركيزًا وجهدًا ممتازين في جلسة اليوم.", child: "بذل طفلك جهدا كبيرا اليوم!" },
        level: {
            beginner: { toddler: "حاليًا، {sub} في مستوى المبتدئين (المستوى {level}). نستخدم نهجًا تدريجيًا لمساعدت{obj} على بناء أساس قوي والاستعداد للخطوات التالية.", teen: "حاليًا، {sub} في مرحلة المبتدئين (المستوى {level}). نتبع برنامجًا منظمًا لضمان استيعاب {sub} لآليات اللغة الأساسية قبل المضي قدمًا.", child: "الطالب حاليًا في مستوى المبتدئين (المستوى {level})، حيث نتبع برنامجًا تدريجيًا مصممًا لبناء أساس قوي والانتقال تدريجيًا إلى المستوى التالي." },
            intermediate: { toddler: "{sub} ينمو بسرعة في مستوانا المتوسط (المستوى {level})! نستخدم قصصًا ممتعة لمساعدت{obj} على استخدام المزيد من الكلمات وفهم جمل أطول.", teen: "{sub} في مستوى متوسط (المستوى {level}). نركز الآن على توسيع مهارات المحادثة والمفردات للسماح بتعبير أكثر طبيعية.", child: "الطالب حاليًا في مستوانا المتوسط (المستوى {level})، حيث نركز على ربط الأفكار وتوسيع المفردات لمساعدت{obj} على التواصل بثقة أكبر." },
            advanced: { toddler: "واو! {sub} يحلق عاليًا في مستوانا المتقدم (المستوى {level}). نلعب ألعابًا معقدة لمساعدت{obj} على التحدث بشكل طبيعي!", teen: "{sub} يؤدي في مستوى متقدم (المستوى {level}). جلساتنا مخصصة الآن لتحسين الفروق الدقيقة والنبرة والحجج المعقدة.", child: "الطالب حاليًا في مستوانا المتقدم (المستوى {level})، حيث نتحدى {obj} بقصص ومناقشات معقدة لإتقان الطلاقة." }
        },
        action: "من خلال الممارسة الأسبوعية المستمرة، يمكننا تعزيز {w1} و {w2} لدي{poss} ومساعدت{obj} على الانتقال بثقة إلى المستوى التالي.",
        closing: { toddler: "أتطلع لرؤيت{obj} في الفصل مرة أخرى! الدروس المنتظمة والممتعة القائمة على اللعب ستساعد في بناء نقاط قوت{poss} وتؤدي إلى تحسن مستمر.", teen: "أتطلع لرؤيت{obj} في الفصل مرة أخرى. الدروس المنتظمة ضرورية للبناء على نقاط القوة الحالية وستؤدي إلى تحسن مستمر.", child: "أتطلع لرؤية طفلك في الفصل مرة أخرى. ستساعد الدروس المنتظمة في البناء على نقاط القوة الحالية وتؤدي إلى تحسن مستمر." }
    },
    tr: {
        opening: { toddler: "Çocuğunuz bugün harika bir iş çıkardı! Birlikte öğrenmek çok eğlenceliydi.", teen: "Öğrenci bugünkü derste mükemmel bir odaklanma ve çaba gösterdi.", child: "Çocuğunuz bugün harika bir çaba gösterdi!" },
        level: {
            beginner: { toddler: "Şu anda, başlangıç seviyesinde (Seviye {level}). Güçlü bir temel oluşturmasına ve sonraki adımlara hazırlanmasına yardımcı olmak için nazik, adım adım bir yaklaşım kullanıyoruz.", teen: "Şu anda, başlangıç aşamasında (Seviye {level}). İlerlemeden önce dilin temel mekaniklerini kavradığından emin olmak için yapılandırılmış bir program izliyoruz.", child: "Öğrenci şu anda başlangıç seviyesinde (Seviye {level}); burada güçlü bir temel oluşturmak ve yavaş yavaş bir sonraki seviyeye geçmek için tasarlanmış adım adım bir program izliyoruz." },
            intermediate: { toddler: "Orta seviyemizde hızla gelişiyor (Seviye {level})! Daha fazla kelime kullanmasına ve daha uzun cümleleri anlamasına yardımcı olmak için eğlenceli hikayeler kullanıyoruz.", teen: "Orta seviyede (Seviye {level}). Artık daha doğal bir ifadeye izin vermek için konuşma becerilerini ve kelime dağarcığını genişletmeye odaklanıyoruz.", child: "Öğrenci şu anda orta seviyemizde (Seviye {level}); burada daha güvenli iletişim kurmasına yardımcı olmak için fikirleri birbirine bağlamaya ve kelime dağarcığını genişletmeye odaklanıyoruz." },
            advanced: { toddler: "Vay canına! İleri seviyemizde yükseklerde uçuyor (Seviye {level}). Doğal bir şekilde konuşmasına yardımcı olmak için karmaşık oyunlar oynuyoruz!", teen: "İleri düzeyde performans gösteriyor (Seviye {level}). Oturumlarımız artık nüans, ton ve karmaşık argümantasyonu geliştirmeye adanmıştır.", child: "Öğrenci şu anda ileri seviyemizde (Seviye {level}); burada akıcılıkta ustalaşması için onu karmaşık hikayeler ve tartışmalarla zorluyoruz." }
        },
        action: "Düzenli haftalık pratikle, {poss} {w1} ve {w2} becerilerini güçlendirebilir ve {poss} bir sonraki seviyeye güvenle geçmesine yardımcı olabiliriz.",
        closing: { toddler: "Onu tekrar derste görmeyi dört gözle bekliyorum! Düzenli, eğlenceli oyun tabanlı dersler, güçlü yönlerini geliştirmeye ve istikrarlı bir ilerlemeye yol açacaktır.", teen: "Onu tekrar derste görmeyi dört gözle bekliyorum. Düzenli dersler, mevcut güçlü yönlerin üzerine inşa etmek için çok önemlidir ve istikrarlı bir ilerlemeye yol açacaktır.", child: "Çocuğunuzu tekrar derste görmeyi dört gözle bekliyorum. Düzenli dersler, mevcut güçlü yönlerin üzerine inşa etmeye yardımcı olacak ve istikrarlı bir ilerlemeye yol açacaktır." }
    }
};

const themeConfig = {
    boy: {
        bg: "bg-gradient-to-br from-[#1E90FF] via-[#48CAE4] to-[#FFD700]",
        cloudOpacity: "opacity-80",
        sunColor: "text-[#FFD700]",
        accentColor: "bg-[#1E90FF]",
        buttonGradient: "bg-gradient-to-r from-[#1E90FF] to-[#007FFF]",
        cardBorder: "border-blue-400/30",
        accentBorder: "border-[#1E90FF]",
        decoIcon: <Rocket className="w-24 h-24 text-[#FFD700] fill-current drop-shadow-lg" />
    },
    girl: {
        bg: "bg-gradient-to-br from-[#F472B6] via-[#C084FC] to-[#22D3EE]",
        cloudOpacity: "opacity-60",
        sunColor: "text-[#FDE047]",
        accentColor: "bg-[#D946EF]",
        buttonGradient: "bg-gradient-to-r from-[#D946EF] to-[#A21CAF]",
        cardBorder: "border-pink-400/30",
        accentBorder: "border-[#D946EF]",
        decoIcon: <Crown className="w-24 h-24 text-[#FDE047] fill-current drop-shadow-lg" />
    },
    teenBoy: {
        bg: "bg-gradient-to-br from-[#0052D4] via-[#4364F7] to-[#6FB1FC]",
        cloudOpacity: "opacity-30",
        sunColor: "text-yellow-300",
        accentColor: "bg-[#2563EB]",
        buttonGradient: "bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]",
        cardBorder: "border-blue-500/30",
        accentBorder: "border-[#2563EB]",
        decoIcon: <Gamepad2 className="w-24 h-24 text-white/40 fill-current drop-shadow-lg" />
    },
    teenGirl: {
        bg: "bg-gradient-to-br from-[#8E2DE2] via-[#4A00E0] to-[#00d2ff]",
        cloudOpacity: "opacity-30",
        sunColor: "text-pink-300",
        accentColor: "bg-[#8B5CF6]",
        buttonGradient: "bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED]",
        cardBorder: "border-purple-500/30",
        accentBorder: "border-[#8B5CF6]",
        decoIcon: <GraduationCap className="w-24 h-24 text-white/40 fill-current drop-shadow-lg" />
    }
};

const translations = {
    en: { name: "English", flag: "🇺🇸", levelLabel: "Level", listening: "Listening", speaking: "Speaking", pronunciation: "Pronunciation", grammar: "Grammar", vocabulary: "Vocabulary", tapToRate: "Start!", learning: "Good Start!", growing: "Getting Better!", shining: "Super Star!", mastering: "Language Hero!", title: "My English Report", reset: "Start Over", showReport: "Finish & See Report", congrats: "Yay! You Did It!", bestEffort: "You are a learning superstar!", tabReport: "Certificate", tabMessage: "🌿 Teacher’s Note", noteCopy: "Copy Message", noteCopied: "Copied!", toMessage: "🌿 Teacher’s Note", certificateTitle: "Certificate of Achievement", strengthTitle: "Super Power!", improveTitle: "Power Up Next" },
    ms: { name: "Bahasa Melayu", flag: "🇲🇾", levelLabel: "Tahap (Level)", listening: "Mendengar", speaking: "Bertutur", pronunciation: "Sebutan", grammar: "Tatabahasa", vocabulary: "Kosa Kata", tapToRate: "Mula!", learning: "Permulaan Baik!", growing: "Makin Bagus!", shining: "Bintang Super!", mastering: "Wira Bahasa!", title: "Laporan Saya", reset: "Mula Semula", showReport: "Lihat Laporan", congrats: "Yay! Kamu Berjaya!", bestEffort: "Kamu Memang Hebat!", tabReport: "Sijil", tabMessage: "🌿 Nota Guru", noteCopy: "Salin Mesej", noteCopied: "Disalin!", toMessage: "🌿 Nota Guru", certificateTitle: "Sijil Pencapaian", strengthTitle: "Kuasa Super!", improveTitle: "Misi Seterusnya" },
    zh: { name: "Chinese", flag: "🇨🇳", levelLabel: "级别", listening: "听力", speaking: "口语", pronunciation: "发音", grammar: "语法", vocabulary: "词汇", tapToRate: "开始!", learning: "起步不错!", growing: "越来越好!", shining: "超级明星!", mastering: "语言小英雄!", title: "我的英语报告", reset: "重新开始", showReport: "查看报告", congrats: "太棒了！", bestEffort: "你是学习小明星！", tabReport: "证书", tabMessage: "🌿 老师留言", noteCopy: "复制留言", noteCopied: "已复制!", toMessage: "🌿 老师留言", certificateTitle: "成就证书", strengthTitle: "超级强项!", improveTitle: "下次目标" },
    th: { name: "Thai", flag: "🇹🇭", levelLabel: "ระดับ", listening: "การฟัง", speaking: "การพูด", pronunciation: "การออกเสียง", grammar: "ไวยากรณ์", vocabulary: "คำศัพท์", tapToRate: "เริ่มเลย!", learning: "เริ่มต้นดี!", growing: "เก่งขึ้นแล้ว!", shining: "ซุปเปอร์สตาร์!", mastering: "ฮีโร่ภาษา!", title: "รายงานของฉัน", reset: "เริ่มใหม่", showReport: "ดูรายงาน", congrats: "เย้! สำเร็จแล้ว!", bestEffort: "หนูเก่งมาก!", tabReport: "เกียรติบัตร", tabMessage: "🌿 บันทึกจากครู", noteCopy: "คัดลอก", noteCopied: "คัดลอกแล้ว!", toMessage: "🌿 บันทึกจากครู", certificateTitle: "ใบประกาศนียบัตร", strengthTitle: "พลังวิเศษ!", improveTitle: "ภารกิจต่อไป" },
    id: { name: "Bahasa Indonesia", flag: "🇮🇩", levelLabel: "Tingkat", listening: "Mendengar", speaking: "Berbicara", pronunciation: "Pelafalan", grammar: "Tata Bahasa", vocabulary: "Kosakata", tapToRate: "Mulai!", learning: "Awal Bagus!", growing: "Makin Pintar!", shining: "Bintang Super!", mastering: "Pahlawan!", title: "Laporanku", reset: "Ulangi", showReport: "Lihat Rapor", congrats: "Hore! Kamu Bisa!", bestEffort: "Kamu Hebat!", tabReport: "Sertifikat", tabMessage: "🌿 Catatan Guru", noteCopy: "Salin Pesan", noteCopied: "Disalin!", toMessage: "🌿 Catatan Guru", certificateTitle: "Sertifikat Prestasi", strengthTitle: "Kekuatan Super!", improveTitle: "Misi Berikutnya" },
    vi: { name: "Vietnamese", flag: "🇻🇳", levelLabel: "Cấp độ", listening: "Nghe", speaking: "Nói", pronunciation: "Phát âm", grammar: "Ngữ pháp", vocabulary: "Từ vựng", tapToRate: "Bắt đầu!", learning: "Khởi đầu tốt!", growing: "Tiến bộ!", shining: "Siêu sao!", mastering: "Anh hùng!", title: "Bảng điểm", reset: "Làm lại", showReport: "Xem báo cáo", congrats: "Hoan hô!", bestEffort: "Bé học giỏi lắm!", tabReport: "Chứng Nhận", tabMessage: "🌿 Ghi chú của GV", noteCopy: "Sao chép", noteCopied: "Đã sao chép!", toMessage: "🌿 Ghi chú của GV", certificateTitle: "Giấy Chứng Nhận", strengthTitle: "Siêu Năng Lực!", improveTitle: "Mục Tiêu Tiếp Theo" },
    ar: { name: "Arabic", flag: "🇸🇦", levelLabel: "مستوى", listening: "الاستماع", speaking: "التحدث", pronunciation: "النطق", grammar: "القواعد", vocabulary: "المفردات", tapToRate: "ابدأ!", learning: "بداية موفقة!", growing: "تتحسن!", shining: "نجم خارق!", mastering: "بطل اللغة!", title: "تقريري", reset: "إعادة", showReport: "عرض التقرير", congrats: "ياي! أحسنت!", bestEffort: "أنت نجم التعلم!", tabReport: "شهادة", tabMessage: "🌿 ملاحظة المعلم", noteCopy: "نسخ الرسالة", noteCopied: "تم النسخ!", toMessage: "🌿 ملاحظة المعلم", certificateTitle: "شهادة إنجاز", strengthTitle: "قوة خارقة!", improveTitle: "المهمة التالية" },
    tr: { name: "Turkish", flag: "🇹🇷", levelLabel: "Seviye", listening: "Dinleme", speaking: "Konuşma", pronunciation: "Telaffuz", grammar: "Dilbilgisi", vocabulary: "Kelime", tapToRate: "Başla!", learning: "Güzel Başlangıç!", growing: "Gelişiyorsun!", shining: "Süper Yıldız!", mastering: "Dil Kahramanı!", title: "Raporum", reset: "Sıfırla", showReport: "Raporu Gör", congrats: "Yaşasın!", bestEffort: "Öğrenme yıldızısın!", tabReport: "Sertifika", tabMessage: "🌿 Öğretmen Notu", noteCopy: "Kopyala", noteCopied: "Kopyalandı!", toMessage: "🌿 Öğretmen Notu", certificateTitle: "Başarı Sertifikası", strengthTitle: "Süper Güç!", improveTitle: "Sonraki Görev" }
};

// --- MEMOIZED COMPONENT (The key to performance) ---

const SkillCard = React.memo(({ id, cat, level, levels, onChange, ageGroup, gender }) => {
    const levelData = levels[level];
    // Pre-calculate visual properties based on index/id to avoid inline arrays
    const cardBg = id === 'listening' ? 'bg-slate-50' : id === 'speaking' ? 'bg-blue-50' : id === 'pronunciation' ? 'bg-emerald-50' : id === 'grammar' ? 'bg-yellow-50' : 'bg-sky-50';

    return (
        <div className={`relative ${cardBg} rounded-3xl p-4 border-[3px] ${levelData.border} group hover:scale-[1.01] transition-transform duration-200 shadow-sm hover:shadow-md will-change-transform`}>
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 flex items-center justify-center rounded-2xl ${levelData.bar} text-white shadow-md transform group-hover:rotate-6 transition-transform duration-300 border-[3px] border-white`}>
                        {React.cloneElement(cat.icon, { className: "w-8 h-8 drop-shadow-sm" })}
                    </div>
                    <div className="flex flex-col">
                        <h3 className="font-black text-lg text-slate-700 tracking-tight leading-none mb-1">{cat.en}</h3>
                        <p className="text-slate-500 text-xs font-bold">{cat.local}</p>
                    </div>
                </div>
            </div>

            <div className="relative h-16 flex items-center select-none px-2 mb-2">
                <div className="absolute left-0 right-0 h-6 bg-white/80 rounded-full overflow-hidden border-2 border-black/5 shadow-inner mx-3">
                    <div
                        className={`h-full ${levelData.bar} transition-all duration-300 ease-out`}
                        style={{ width: `${(level / 4) * 100}%` }}
                    />
                </div>

                {/* Invisible Slider for Touch */}
                <input
                    type="range"
                    min="0"
                    max="4"
                    step="1"
                    value={level}
                    onChange={(e) => onChange(id, e.target.value)}
                    className="absolute w-full h-full opacity-0 cursor-pointer z-30"
                />

                <div className="absolute w-full left-0 flex justify-between z-40 px-0 pointer-events-none">
                    {[0, 1, 2, 3, 4].map((step) => {
                        const isCurrentThumb = step === level && step > 0;
                        const stepBg = level >= step ? levels[level].bar : 'bg-white';
                        return (
                            <div key={step} className={`transition-all duration-300 relative ${step === 0 ? 'w-12 h-12 invisible' : ''} ${step > 0 && level >= step ? 'scale-110 -translate-y-2' : ''}`}>
                                {step > 0 && (
                                    <div className={`w-14 h-14 rounded-full border-[4px] ${stepBg} flex items-center justify-center transition-colors duration-300 ${level >= step ? 'border-white shadow-md' : 'border-slate-200'} `}>
                                        <div className="relative">
                                            {ageGroup === 'teen' ?
                                                <Trophy className={`w-7 h-7 text-white fill-current ${isCurrentThumb ? 'scale-110' : ''}`} strokeWidth={2} /> :
                                                gender === 'girl' ?
                                                    <Sparkles className={`w-7 h-7 text-white fill-current ${isCurrentThumb ? 'scale-110' : ''}`} strokeWidth={2.5} /> :
                                                    <Star className={`w-7 h-7 text-white fill-current ${isCurrentThumb ? 'scale-110' : ''}`} strokeWidth={2.5} />
                                            }
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className={`text-center py-2 px-4 rounded-xl ${levelData.bg} ${levelData.text} font-black text-sm uppercase tracking-wide border-2 ${levelData.border} transition-colors duration-300 flex justify-between items-center shadow-sm`}>
                <span className="text-[10px] opacity-70">{levelData.localLabel}</span>
                <span>{levelData.label}</span>
            </div>
        </div>
    );
}, (prev, next) => {
    // Custom comparison function for React.memo
    // Only re-render if these specific props change
    return prev.level === next.level &&
        prev.id === next.id &&
        prev.gender === next.gender &&
        prev.ageGroup === next.ageGroup &&
        prev.levels === next.levels; // levels object reference is stable thanks to useMemo in parent
});

const FeedbackBoard = () => {
    // Initial state
    const initialFeedback = { listening: 0, speaking: 0, pronunciation: 0, grammar: 0, vocabulary: 0 };
    const [feedback, setFeedback] = useState(initialFeedback);
    const [selectedLang, setSelectedLang] = useState('en');
    const [showCelebration, setShowCelebration] = useState(false);
    const [studentLevel, setStudentLevel] = useState(1);
    const [showLevelMenu, setShowLevelMenu] = useState(false);
    const [modalTab, setModalTab] = useState('report');
    const [copied, setCopied] = useState(false);
    const [gender, setGender] = useState('boy');
    const [ageGroup, setAgeGroup] = useState('child');

    const t = translations[selectedLang];

    // --- MEMOIZED CALCULATIONS (Performance Optimization) ---

    const currentTheme = useMemo(() => {
        if (ageGroup === 'teen') return gender === 'girl' ? themeConfig.teenGirl : themeConfig.teenBoy;
        return gender === 'girl' ? themeConfig.girl : themeConfig.boy;
    }, [gender, ageGroup]);

    const certTheme = useMemo(() => {
        if (ageGroup === 'toddler') {
            return gender === 'girl'
                ? { borderColor: 'border-pink-300', titleColor: 'text-pink-600', icon: <Baby className="w-24 h-24 text-pink-400 fill-current opacity-80" />, accent: 'bg-pink-50 border-pink-200', accentIcon: 'text-pink-500', ribbonFrom: 'from-pink-300', ribbonTo: 'to-pink-500' }
                : { borderColor: 'border-sky-300', titleColor: 'text-sky-600', icon: <Baby className="w-24 h-24 text-sky-400 fill-current opacity-80" />, accent: 'bg-sky-50 border-sky-200', accentIcon: 'text-sky-500', ribbonFrom: 'from-sky-300', ribbonTo: 'to-sky-500' };
        }
        if (ageGroup === 'teen') {
            return gender === 'girl'
                ? { borderColor: 'border-fuchsia-700', titleColor: 'text-fuchsia-800', icon: <Trophy className="w-24 h-24 text-fuchsia-700 fill-current opacity-80" />, accent: 'bg-fuchsia-50 border-fuchsia-200', accentIcon: 'text-fuchsia-600', ribbonFrom: 'from-fuchsia-600', ribbonTo: 'to-purple-800' }
                : { borderColor: 'border-indigo-700', titleColor: 'text-indigo-800', icon: <Medal className="w-24 h-24 text-indigo-700 fill-current opacity-80" />, accent: 'bg-indigo-50 border-indigo-200', accentIcon: 'text-indigo-600', ribbonFrom: 'from-blue-700', ribbonTo: 'to-indigo-900' };
        }
        return gender === 'girl'
            ? { borderColor: 'border-purple-400', titleColor: 'text-purple-700', icon: <Crown className="w-24 h-24 text-purple-500 fill-current opacity-80" />, accent: 'bg-pink-50 border-pink-200', accentIcon: 'text-pink-500', ribbonFrom: 'from-pink-400', ribbonTo: 'to-purple-600' }
            : { borderColor: 'border-yellow-500', titleColor: 'text-slate-700', icon: <Star className="w-24 h-24 text-yellow-500 fill-current opacity-80" />, accent: 'bg-blue-50 border-blue-200', accentIcon: 'text-blue-500', ribbonFrom: 'from-yellow-400', ribbonTo: 'to-orange-600' };
    }, [gender, ageGroup]);

    const levels = useMemo(() => {
        // Current translations for levels
        const lt = translations[selectedLang];
        const tapToRate = lt.tapToRate;
        const learning = lt.learning;
        const growing = lt.growing;
        const shining = lt.shining;
        const mastering = lt.mastering;

        if (ageGroup === 'teen') {
            return {
                0: { label: 'Start', localLabel: tapToRate, bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-500', bar: 'bg-slate-200' },
                1: { label: 'Bronze', localLabel: learning, bg: 'bg-orange-50', border: 'border-orange-400', text: 'text-orange-600', bar: 'bg-orange-500' },
                2: { label: 'Silver', localLabel: growing, bg: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-600', bar: 'bg-blue-500' },
                3: { label: 'Gold', localLabel: shining, bg: 'bg-yellow-50', border: 'border-yellow-400', text: 'text-yellow-700', bar: 'bg-yellow-400' },
                4: { label: 'Master', localLabel: mastering, bg: 'bg-purple-50', border: 'border-purple-400', text: 'text-purple-600', bar: 'bg-purple-500' }
            };
        }
        if (gender === 'girl') {
            return {
                0: { label: 'Start!', localLabel: tapToRate, bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-500', bar: 'bg-slate-200' },
                1: { label: 'Good!', localLabel: learning, bg: 'bg-teal-100', border: 'border-teal-300', text: 'text-teal-600', bar: 'bg-teal-400' },
                2: { label: 'Better!', localLabel: growing, bg: 'bg-sky-100', border: 'border-sky-300', text: 'text-sky-600', bar: 'bg-sky-400' },
                3: { label: 'Super!', localLabel: shining, bg: 'bg-rose-100', border: 'border-rose-300', text: 'text-rose-600', bar: 'bg-rose-400' },
                4: { label: 'Hero!', localLabel: mastering, bg: 'bg-violet-100', border: 'border-violet-300', text: 'text-violet-600', bar: 'bg-violet-400' }
            };
        }
        return {
            0: { label: 'Start!', localLabel: tapToRate, bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-500', bar: 'bg-slate-200' },
            1: { label: 'Good!', localLabel: learning, bg: 'bg-emerald-100', border: 'border-emerald-300', text: 'text-emerald-600', bar: 'bg-emerald-400' },
            2: { label: 'Better!', localLabel: growing, bg: 'bg-blue-100', border: 'border-[#1E90FF]', text: 'text-[#1E90FF]', bar: 'bg-[#1E90FF]' },
            3: { label: 'Super!', localLabel: shining, bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-600', bar: 'bg-orange-400' },
            4: { label: 'Hero!', localLabel: mastering, bg: 'bg-yellow-100', border: 'border-[#FFD700]', text: 'text-yellow-700', bar: 'bg-[#FFD700]' }
        };
    }, [gender, ageGroup, selectedLang]);

    const categories = useMemo(() => [
        { id: 'listening', en: 'Listening', local: t.listening, icon: <Headphones className="w-8 h-8" /> },
        { id: 'speaking', en: 'Speaking', local: t.speaking, icon: <Megaphone className="w-8 h-8" /> },
        { id: 'pronunciation', en: 'Pronunciation', local: t.pronunciation, icon: <Mic className="w-8 h-8" /> },
        { id: 'grammar', en: 'Grammar', local: t.grammar, icon: <Pencil className="w-8 h-8" /> },
        { id: 'vocabulary', en: 'Vocabulary', local: t.vocabulary, icon: <BookOpen className="w-8 h-8" /> }
    ], [t]);

    // UseCallback prevents the function from being recreated on every render
    const handleSlide = useCallback((id, value) => {
        setFeedback(prev => ({ ...prev, [id]: parseInt(value) }));
    }, []);

    const resetBoard = () => {
        setFeedback(initialFeedback);
        setStudentLevel(1);
        setShowCelebration(false);
        setCopied(false);
    };

    const getNoteContent = (lang) => {
        // 1. Identify Weakest Categories (For "Action Plan" - e.g. "Listening and Grammar")
        // We map categories to get their localized names
        const scores = categories.map(cat => ({ id: cat.id, score: feedback[cat.id], name: cat.local }));
        const sorted = [...scores].sort((a, b) => b.score - a.score);
        const w1 = sorted[sorted.length - 1].name;
        const w2 = sorted[sorted.length - 2].name;

        // 2. Identify Tier (Beginner/Intermediate/Advanced)
        let tierKey = 'beginner';
        if (studentLevel >= 4 && studentLevel <= 6) tierKey = 'intermediate';
        if (studentLevel >= 7) tierKey = 'advanced';

        // 3. Identify Age Group Key (toddler/teen/child)
        const ageKey = ageGroup; // 'toddler', 'teen', or 'child'

        // 4. Get Translations for current Lang
        const template = reportTranslations[lang] || reportTranslations.en;

        // 5. Gender Logic (Pronouns)
        const isGirl = gender === 'girl';
        let sub, obj, poss;

        // Simple pronoun logic (expandable for specific languages if needed)
        if (lang === 'en') {
            sub = isGirl ? "She" : "He";
            obj = isGirl ? "her" : "him";
            poss = isGirl ? "her" : "his";
        } else if (lang === 'zh') {
            sub = isGirl ? "她" : "他";
            obj = isGirl ? "她" : "他";
            poss = isGirl ? "她的" : "他的";
        } else if (lang === 'ar') {
            sub = isGirl ? "هي" : "هو";
            obj = isGirl ? "ـها" : "ـه";
            poss = isGirl ? "ـها" : "ـه";
        } else {
            // Default Neutral/Name-based logic for other langs if specific pronouns aren't critical in short form
            // Or specific overrides:
            if (lang === 'ms') { sub = "Dia"; obj = "dia"; poss = "nya"; } // Malay neutral
            else if (lang === 'th') { sub = ageGroup === 'toddler' ? "น้อง" : (isGirl ? "เธอ" : "เขา"); obj = sub; poss = sub; }
            else if (lang === 'id') { sub = "Dia"; obj = "dia"; poss = "nya"; }
            else if (lang === 'vi') { sub = ageGroup === 'teen' ? "Em" : "Bé"; obj = sub; poss = sub; }
            else if (lang === 'tr') { sub = "O"; obj = "onu"; poss = "Onun"; }
        }

        // 6. Assemble Parts
        // Opening
        let openingText = template.opening[ageKey]
            .replace(/{sub}/g, sub);

        // Level Message
        let levelText = template.level[tierKey][ageKey]
            .replace(/{level}/g, studentLevel)
            .replace(/{sub}/g, sub)
            .replace(/{obj}/g, obj)
            .replace(/{poss}/g, poss);

        // Action Plan
        let actionText = template.action
            .replace(/{poss}/g, poss)
            .replace(/{obj}/g, obj)
            .replace(/{w1}/g, w1)
            .replace(/{w2}/g, w2);

        // Closing
        let closingText = template.closing[ageKey]
            .replace(/{obj}/g, obj)
            .replace(/{poss}/g, poss);

        return `${openingText}\n\n${levelText}\n\n${actionText}\n\n${closingText}`;
    };

    const generateParentNote = useMemo(() => getNoteContent(selectedLang), [feedback, ageGroup, studentLevel, selectedLang, gender]);
    const generateEnglishParentNote = useMemo(() => getNoteContent('en'), [feedback, ageGroup, studentLevel, gender]);

    const certStats = useMemo(() => {
        const scores = categories.map(cat => ({ ...cat, score: feedback[cat.id] }));
        const sorted = [...scores].sort((a, b) => b.score - a.score);
        const strength = sorted[0];
        const improvements = sorted.slice(-2);
        return { strength, improvements };
    }, [feedback, categories]);

    const copyToClipboard = () => {
        const text = generateParentNote;
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
        document.body.removeChild(textArea);
    };

    const cloudPattern = `data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 40a10 10 0 0 1 10-10h5a15 15 0 0 1 30 0h5a10 10 0 0 1 0 20h-50a10 10 0 0 1 0-20z' fill='white' fill-opacity='0.2' transform='translate(10,10)'/%3E%3C/svg%3E`;

    return (
        <div className={`min-h-screen ${currentTheme.bg} p-2 md:p-4 font-sans selection:bg-pink-200 relative overflow-x-hidden pb-32 transition-colors duration-700 ease-in-out`}>
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `url("${cloudPattern}")`, backgroundSize: '120px 120px' }} />

            {/* BACKGROUND DECORATIONS (CSS Only - Low Cost) */}
            <div className={`fixed top-10 right-10 transition-all duration-700 ${currentTheme.cloudOpacity}`}>
                {currentTheme.decoIcon}
            </div>
            <div className="fixed top-20 left-10 opacity-40">
                <Cloud className="w-20 h-20 text-white fill-current drop-shadow-md" />
            </div>

            <div className="w-full max-w-[90rem] mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-6 relative flex flex-col items-center justify-center mt-2">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] transform -rotate-2">
                            {t.title}
                        </h1>
                    </div>

                    {/* Top Left Controls */}
                    <div className="absolute left-4 top-2 z-30 flex items-center gap-2">
                        <button onClick={resetBoard} className="flex items-center gap-2 text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all font-black text-sm md:text-base p-3 rounded-2xl border-2 border-white/50 hover:scale-105 active:scale-95 shadow-lg">
                            <RotateCcw className="w-5 h-5 md:w-6 md:h-6" />
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setShowLevelMenu(!showLevelMenu)}
                                className={`flex items-center gap-2 text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all font-black text-sm md:text-base p-3 rounded-2xl border-2 ${showLevelMenu ? 'border-white bg-white/40' : 'border-white/50'} hover:scale-105 active:scale-95 shadow-lg`}
                            >
                                <Layers className="w-5 h-5 md:w-6 md:h-6" />
                                <span className="hidden md:block">{t.levelLabel}</span> {studentLevel}
                            </button>

                            {showLevelMenu && (
                                <div className="absolute top-full left-0 mt-2 bg-white/95 rounded-2xl border-2 border-white/50 shadow-xl p-2 grid grid-cols-2 gap-2 w-32 z-50">
                                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => { setStudentLevel(level); setShowLevelMenu(false); }}
                                            className={`py-2 rounded-xl font-bold transition-colors ${studentLevel === level ? `${currentTheme.accentColor} text-white` : 'text-slate-500 hover:bg-slate-100'}`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* CONTROLS (Top Right) */}
                    <div className="absolute right-4 top-2 z-30 flex flex-col md:flex-row gap-3 items-end md:items-start">
                        {/* AGE GROUP TOGGLE */}
                        <div className="flex gap-1">
                            <button onClick={() => setAgeGroup('toddler')} className={`p-2 rounded-xl transition-all duration-200 flex items-center gap-1 border-2 ${ageGroup === 'toddler' ? 'bg-white/20 backdrop-blur-sm border-white/60 text-white shadow-sm' : 'border-transparent text-white/80 hover:bg-white/10'}`}><Baby className="w-5 h-5" /></button>
                            <button onClick={() => setAgeGroup('child')} className={`p-2 rounded-xl transition-all duration-200 flex items-center gap-1 border-2 ${ageGroup === 'child' ? 'bg-white/20 backdrop-blur-sm border-white/60 text-white shadow-sm' : 'border-transparent text-white/80 hover:bg-white/10'}`}><Gamepad2 className="w-5 h-5" /></button>
                            <button onClick={() => setAgeGroup('teen')} className={`p-2 rounded-xl transition-all duration-200 flex items-center gap-1 border-2 ${ageGroup === 'teen' ? 'bg-white/20 backdrop-blur-sm border-white/60 text-white shadow-sm' : 'border-transparent text-white/80 hover:bg-white/10'}`}><GraduationCap className="w-5 h-5" /></button>
                        </div>
                        {/* GENDER TOGGLE */}
                        <div className="flex gap-2">
                            <button onClick={() => setGender('boy')} className={`p-3 rounded-2xl border-2 transition-all duration-300 shadow-lg flex items-center justify-center ${gender === 'boy' ? (ageGroup === 'teen' ? 'bg-blue-600 border-white text-white scale-110' : 'bg-[#1E90FF] border-white text-white scale-110') : 'bg-white/20 border-white/50 text-white hover:bg-white/30'}`}>{ageGroup === 'teen' ? <Gamepad2 className="w-5 h-5" /> : <Rocket className="w-5 h-5" />}</button>
                            <button onClick={() => setGender('girl')} className={`p-3 rounded-2xl border-2 transition-all duration-300 shadow-lg flex items-center justify-center ${gender === 'girl' ? (ageGroup === 'teen' ? 'bg-rose-500 border-white text-white scale-110' : 'bg-[#D946EF] border-white text-white scale-110') : 'bg-white/20 border-white/50 text-white hover:bg-white/30'}`}>{ageGroup === 'teen' ? <GraduationCap className="w-5 h-5" /> : <Crown className="w-5 h-5" />}</button>
                        </div>
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-white/95 backdrop-blur-sm rounded-[2.5rem] shadow-xl overflow-hidden border-[6px] border-white/60 ring-4 ring-black/5 relative">

                    {/* Progress Items */}
                    <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                        {categories.map((cat) => (
                            <SkillCard
                                key={cat.id}
                                id={cat.id}
                                cat={cat}
                                level={feedback[cat.id]}
                                levels={levels}
                                onChange={handleSlide}
                                ageGroup={ageGroup}
                                gender={gender}
                            />
                        ))}
                    </div>

                    <div className="bg-slate-50 p-6 flex justify-center items-center relative z-20 border-t-4 border-slate-100">
                        <button onClick={() => { setShowCelebration(true); setModalTab('report'); }} className={`${currentTheme.buttonGradient} text-white border-[3px] shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all px-8 py-4 rounded-full font-black text-xl flex items-center gap-3 w-full md:w-auto justify-center group border-white/20`}>
                            <Trophy className="w-8 h-8 group-hover:scale-110 transition-transform text-white fill-current" />
                            {t.showReport}
                        </button>
                    </div>
                </div>

                {/* FUN LANGUAGE SELECTOR */}
                <div className={`fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t-[4px] p-1.5 z-[300] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] ${currentTheme.accentBorder}`}>
                    <div className="max-w-7xl mx-auto flex items-center justify-start md:justify-center gap-2 overflow-x-auto scrollbar-hide py-1">
                        <div className={`px-2 py-1 rounded-lg mr-1 shrink-0 border-2 ${currentTheme.accentBorder} bg-white`}>
                            <Globe className={`w-4 h-4 ${gender === 'girl' ? 'text-purple-500' : 'text-blue-500'}`} />
                        </div>
                        {Object.keys(translations).map((langKey) => (
                            <button key={langKey} onClick={() => setSelectedLang(langKey)} className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all transform hover:scale-105 active:scale-95 whitespace-nowrap border-b-2 ${selectedLang === langKey ? `${currentTheme.buttonGradient} text-white border-white/50 shadow-sm` : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'}`}>
                                <span className="text-base drop-shadow-sm">{translations[langKey].flag}</span>
                                {translations[langKey].name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* CELEBRATION MODAL WITH TABS */}
                {showCelebration && (
                    <div className={`fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm`}>
                        {/* WIDER MODAL (max-w-5xl) FOR LANDSCAPE CERTIFICATE */}
                        <div className="bg-white rounded-[2rem] p-6 w-full max-w-5xl shadow-2xl border-[8px] transform relative flex flex-col gap-4 h-auto min-h-[60vh] max-h-[90vh] overflow-hidden" style={{ borderColor: gender === 'girl' ? '#F472B6' : '#FFD700' }}>

                            <div className="absolute inset-0 opacity-10 pointer-events-none bg-slate-50" style={{ backgroundImage: `url("${cloudPattern}")`, backgroundSize: '100px 100px' }} />
                            <button onClick={() => setShowCelebration(false)} className="absolute top-4 right-4 bg-slate-100 p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors z-20 border-2 border-slate-200"><X className="w-6 h-6" /></button>

                            {/* TAB NAVIGATION */}
                            <div className="flex gap-2 relative z-10 shrink-0 mt-8 md:mt-0 max-w-md mx-auto w-full">
                                <button onClick={() => setModalTab('report')} className={`flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-wider border-b-4 transition-all ${modalTab === 'report' ? `${currentTheme.accentColor} text-white border-white shadow-md` : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                                    {t.tabReport}
                                </button>
                                <button onClick={() => setModalTab('message')} className={`flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-wider border-b-4 transition-all ${modalTab === 'message' ? `${currentTheme.accentColor} text-white border-white shadow-md` : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                                    {t.tabMessage}
                                </button>
                            </div>

                            {/* TAB CONTENT: REPORT (CERTIFICATE) */}
                            {modalTab === 'report' && (
                                <div className="flex flex-col flex-1 gap-4 items-center justify-center relative z-10 w-full overflow-y-auto">
                                    {/* Certificate Frame - WIDER (w-full) */}
                                    <div
                                        className={`p-8 rounded-sm shadow-[0_4px_24px_rgba(0,0,0,0.1),0_8px_16px_rgba(0,0,0,0.1)] w-full relative overflow-hidden flex flex-col items-center text-center border-[12px] border-double ${certTheme.borderColor}`}
                                        style={{ backgroundImage: 'linear-gradient(to bottom right, #FFFDF5, #FFF8E1)' }}
                                    >
                                        {/* Paper Texture Overlay */}
                                        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

                                        {/* Inner Border mimicking print margins */}
                                        <div className="absolute inset-4 border-2 border-dashed border-slate-300/50 rounded-sm pointer-events-none"></div>

                                        {/* Large Background Watermark */}
                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                                            {React.cloneElement(certTheme.icon, { className: "w-64 h-64 text-black" })}
                                        </div>

                                        {/* Corner Ribbons (Using dynamic colors) */}
                                        <div className={`absolute top-0 left-0 w-24 h-24 bg-gradient-to-br ${certTheme.ribbonFrom} ${certTheme.ribbonTo} transform -rotate-45 -translate-x-12 -translate-y-12 z-0 shadow-sm`}></div>
                                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${certTheme.ribbonFrom} ${certTheme.ribbonTo} transform rotate-45 translate-x-12 -translate-y-12 z-0 shadow-sm`}></div>
                                        <div className={`absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr ${certTheme.ribbonFrom} ${certTheme.ribbonTo} transform rotate-45 -translate-x-12 translate-y-12 z-0 shadow-sm`}></div>
                                        <div className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl ${certTheme.ribbonFrom} ${certTheme.ribbonTo} transform -rotate-45 translate-x-12 translate-y-12 z-0 shadow-sm`}></div>

                                        <div className="relative z-10 w-full flex flex-col items-center">
                                            <div className="mb-2 relative">
                                                {certTheme.icon}
                                            </div>

                                            <h2 className={`text-3xl md:text-5xl font-serif font-bold uppercase tracking-widest mb-1 ${certTheme.titleColor} drop-shadow-sm`}>
                                                {t.certificateTitle}
                                            </h2>
                                            <p className="text-slate-500 font-bold uppercase tracking-wider text-sm mb-6 font-serif">Lesson Completed Successfully!</p>

                                            <div className="w-full h-px bg-slate-300 mb-6"></div>

                                            {/* Strength & Improvements Section - LANDSCAPE GRID */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-6">
                                                <div className={`p-6 rounded-xl border ${certTheme.accent} flex flex-col items-center gap-2 transform hover:scale-105 transition-transform bg-white/60 backdrop-blur-sm shadow-sm`}>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Crown className={`w-5 h-5 ${certTheme.accentIcon}`} />
                                                        <span className={`font-black uppercase tracking-wider text-xs ${certTheme.accentIcon}`}>{t.strengthTitle}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        {React.cloneElement(certStats.strength.icon, { className: "w-10 h-10 text-slate-700" })}
                                                        <span className="font-serif font-bold text-2xl md:text-3xl text-slate-800">{certStats.strength.local}</span>
                                                    </div>
                                                </div>

                                                <div className="bg-white/40 rounded-xl border border-slate-200 p-6 relative overflow-hidden flex flex-col justify-center">
                                                    <div className="flex items-center justify-center gap-2 mb-3 relative z-10">
                                                        <Zap className="w-4 h-4 text-yellow-600 fill-yellow-600" />
                                                        <span className="font-bold uppercase tracking-wider text-xs text-slate-500">{t.improveTitle}</span>
                                                    </div>
                                                    <div className="flex justify-center gap-4 relative z-10">
                                                        {certStats.improvements.map((cat) => (
                                                            <div key={cat.id} className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
                                                                {React.cloneElement(cat.icon, { className: "w-5 h-5 text-slate-500" })}
                                                                <span className="font-serif font-bold text-sm text-slate-600">{cat.local}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Footer */}
                                            <div className="flex justify-between w-full text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 px-8 font-serif">
                                                <span>{new Date().toLocaleDateString()}</span>
                                                <span>Official Record</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button onClick={() => setModalTab('message')} className={`w-full max-w-lg py-3 rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all shadow-lg border-b-4 active:border-b-0 active:translate-y-1 ${currentTheme.buttonGradient} text-white border-white/20 mt-4`}>
                                        <Mail className="w-5 h-5" /> {t.toMessage}
                                    </button>
                                </div>
                            )}

                            {/* TAB CONTENT: MESSAGE (FULL HEIGHT - LANDSCAPE OPTIMIZED) */}
                            {modalTab === 'message' && (
                                <div className="flex flex-col flex-1 relative z-10 h-full min-h-0">
                                    <div className={`p-1 rounded-3xl border-[3px] flex flex-col relative shadow-inner flex-1 min-h-0 ${gender === 'girl' ? 'bg-purple-50 border-purple-100' : 'bg-yellow-50 border-yellow-100'}`}>
                                        <div className="bg-white p-6 rounded-[1.2rem] shadow-sm border border-slate-100 text-slate-700 font-medium text-lg leading-relaxed whitespace-pre-line overflow-y-auto flex-1 h-full">
                                            {/* LANDSCAPE LAYOUT FOR BILINGUAL TEXT */}
                                            <div className={`h-full ${selectedLang !== 'en' ? 'md:grid md:grid-cols-2 md:gap-8' : ''}`}>
                                                <div className="flex flex-col">
                                                    {selectedLang !== 'en' && <span className="text-xs font-bold uppercase text-slate-400 mb-2 block md:hidden">Translation</span>}
                                                    {generateParentNote}
                                                </div>

                                                {selectedLang !== 'en' && (
                                                    <div className="mt-8 pt-6 md:mt-0 md:pt-0 border-t-2 md:border-t-0 md:border-l-2 border-dashed border-slate-100 md:pl-8 flex flex-col">
                                                        <p className="text-slate-400 text-xs font-bold uppercase mb-4 tracking-wider flex items-center gap-2">
                                                            <Globe className="w-4 h-4" /> English Reference
                                                        </p>
                                                        <p className="text-slate-500 text-base italic leading-relaxed">{generateEnglishParentNote}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 shrink-0">
                                        <button onClick={copyToClipboard} className={`w-full py-4 rounded-2xl font-black text-2xl flex items-center justify-center gap-3 transition-all shadow-xl border-b-[6px] active:border-b-0 active:translate-y-1.5 ${copied ? 'bg-green-500 border-green-700 text-white' : `${currentTheme.buttonGradient} border-white/20 text-white`}`}>
                                            {copied ? <Check className="w-8 h-8" /> : <Copy className="w-8 h-8" />}
                                            {copied ? t.noteCopied : t.noteCopy}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        .font-arabic { font-family: 'Noto Sans Arabic', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        /* Hide Scrollbar */
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
        </div>
    );
};

export default FeedbackBoard;