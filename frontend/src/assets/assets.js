import appointment_img from './appointment_img.png'
import group_profiles from './group_profiles.png'
import profile_pic from './profile_pic.png'
import contact_image from './contact_image.png'
import about_image from './about_image.png'
import hospital_video from './hospital.mp4'
import medical_video from './medical.mp4'
import glasseson1 from './glasseson1.mp4'
import glasseson2 from './glasseson2.mp4'
import glasseson3 from './glasseson3.mp4'
import glasseson4 from './glasseson4.mp4'
import glasseson5 from './glasseson5.mp4'
import logo from './logo.svg'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.svg'
import verified_icon from './verified_icon.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import stripe_logo from './stripe_logo.png'
import razorpay_logo from './razorpay_logo.png'
import paymongo_logo from './paymongo_logo.png'
import doc1 from './doc1.png'
import doc2 from './doc2.png'
import doc3 from './doc3.png'
import doc4 from './doc4.png'
import doc5 from './doc5.png'
import doc6 from './doc6.png'
import doc7 from './doc7.png'
import doc8 from './doc8.png'
import doc9 from './doc9.png'
import doc10 from './doc10.png'
import doc11 from './doc11.png'
import doc12 from './doc12.png'
import doc13 from './doc13.png'
import doc14 from './doc14.png'
import doc15 from './doc15.png'
import Dermatologist from './Dermatologist.svg'
import Gastroenterologist from './Gastroenterologist.svg'
import General_physician from './General_physician.svg'
import Gynecologist from './Gynecologist.svg'
import Neurologist from './Neurologist.svg'
import Pediatricians from './Pediatricians.svg'
import pic1 from './3.png'
import pic2 from './5.png'
import pic3 from './1.png'
import pic4 from './2.png'
import pic5 from './4.png'


export const assets = {
    appointment_img,
    group_profiles,
    logo,
    chats_icon,
    verified_icon,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_image,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon,
    stripe_logo,
    razorpay_logo,
    paymongo_logo,
    hospital_video,
    medical_video,
    glasseson1,
    glasseson2,
    glasseson3,
    glasseson4,
    glasseson5,
    pic1,
    pic2,
    pic3,
    pic4,
    pic5
}

export const specialityData = [
    {
        speciality: 'General physician',
        image: General_physician
    },
    {
        speciality: 'Gynecologist',
        image: Gynecologist
    },
    {
        speciality: 'Dermatologist',
        image: Dermatologist
    },
    {
        speciality: 'Pediatricians',
        image: Pediatricians
    },
    {
        speciality: 'Neurologist',
        image: Neurologist
    },
    {
        speciality: 'Gastroenterologist',
        image: Gastroenterologist
    },
]

export const doctors = [
    {
        _id: 'doc1',
        name: 'Dr. Miguel Santos',
        image: doc1,
        speciality: 'General physician',
        degree: 'Doctor of Medicine (MD)',
        experience: '5 Years',
        about: 'Dr. Santos has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Santos has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '123 Rizal Avenue, Barangay Malate',
            line2: 'Manila City, Metro Manila, Philippines'
        }
    },
    {
        _id: 'doc2',
        name: 'Dr. Angela Reyes',
        image: doc2,
        speciality: 'Gynecologist',
        degree: 'Doctor of Medicine (MD)',
        experience: '6 Years',
        about: 'Dr. Reyes specializes in women’s reproductive health, providing care for conditions related to the female reproductive system. She offers consultations on menstrual health, family planning, prenatal care, and routine gynecological examinations. She is committed to delivering safe, compassionate, and patient-centered care for women at every stage of life.',
        fees: 60,
        address: {
            line1: '45 Mabini Street, Barangay San Lorenzo',
            line2: 'Makati City, Metro Manila, Philippines'
        }
    },
    {
        _id: 'doc3',
        name: 'Dr. Nicole Cruz',
        image: doc3,
        speciality: 'Dermatologist',
        degree: 'Doctor of Medicine (MD)',
        experience: '4 Years',
        about: 'Dr. Cruz specializes in diagnosing and treating skin, hair, and nail conditions. She provides care for acne, skin allergies, infections, and other dermatological concerns, as well as guidance on proper skin care and treatment plans. She is committed to helping patients achieve healthy skin through safe and effective solutions.',
        fees: 40,
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc4',
        name: 'Dr. Joshua Mendoza',
        image: doc4,
        speciality: 'Pediatrician',
        degree: 'Doctor of Medicine (MD)',
        experience: '5 Years',
        about: 'Dr. Mendoza specializes in the medical care of infants, children, and adolescents. He provides consultations for common childhood illnesses, vaccinations, growth and development monitoring, and preventive care. He is dedicated to ensuring the health and well-being of young patients through compassionate and family-centered care.',
        fees: 50,
        address: {
            line1: '47th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc5',
        name: 'Dr. Patricia Lim',
        image: doc5,
        speciality: 'Neurologist',
        degree: 'Doctor of Medicine (MD)',
        experience: '6 Years',
        about: 'Dr. Lim specializes in diagnosing and treating disorders of the brain, spine, and nervous system. She provides care for conditions such as migraines, epilepsy, stroke, and nerve-related disorders. She is committed to delivering accurate diagnosis and personalized treatment plans to improve patients’ neurological health and quality of life.',
        fees: 60,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc6',
        name: 'Dr. Mark Dela Cruz',
        image: doc6,
        speciality: 'Neurologist',
        degree: 'Doctor of Medicine (MD)',
        experience: '8 Years',
        about: 'Dr. Dela Cruz focuses on the evaluation and management of neurological conditions affecting the brain and nervous system. He provides care for headaches, nerve disorders, seizures, and other neurological concerns, offering patient-centered treatment plans aimed at improving overall neurological function and quality of life.',
        fees: 80,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc7',
        name: 'Dr. Carlo Ramirez',
        image: doc7,
        speciality: 'General physician',
        degree: 'Doctor of Medicine (MD)',
        experience: '4 Years',
        about: 'Dr. Ramirez provides comprehensive primary care, focusing on the prevention, diagnosis, and management of common health conditions. He offers consultations for routine check-ups, minor illnesses, and general health concerns, ensuring patients receive timely and effective medical attention.',
        fees: 40,
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc8',
        name: 'Dr. Pedro Penduko',
        image: doc8,
        speciality: 'Gynecologist',
        degree: 'Doctor of Medicine (MD)',
        experience: '7 Years',
        about: 'Dr. Penduko provides specialized care for women’s health, including reproductive system concerns, prenatal care, and routine examinations, ensuring safe and comprehensive treatment.',
        fees: 70,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc9',
        name: 'Dr. Rosaria Mary',
        image: doc9,
        speciality: 'Dermatologist',
        degree: 'Doctor of Medicine (MD)',
        experience: '3 Years',
        about: 'Dr. Mary treats a wide range of skin conditions such as acne, infections, and allergies, while also offering guidance on maintaining healthy skin.',
        fees: 30,
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc10',
        name: 'Dr. Jeffrey Sandigan',
        image: doc10,
        speciality: 'Pediatrician',
        degree: 'Doctor of Medicine (MD)',
        experience: '6.5 Years',
        about: 'Dr. Sandigan focuses on children’s health, providing vaccinations, illness management, and growth monitoring to support healthy development from infancy to adolescence.',
        fees: 65,
        address: {
            line1: '47th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc11',
        name: 'Dr. Zoe Sanititigan',
        image: doc11,
        speciality: 'Neurologist',
        degree: 'Doctor of Medicine (MD)',
        experience: '5 Years',
        about: 'Dr. Sanititigan specializes in diagnosing and managing neurological disorders, including stroke, epilepsy, and chronic headaches, with a focus on improving patient quality of life.',
        fees: 50,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc12',
        name: 'Dr. Patrick Cruz',
        image: doc12,
        speciality: 'Neurologist',
        degree: 'Doctor of Medicine (MD)',
        experience: '4 Years',
        about: 'Dr. Cruz provides care for brain and nerve-related conditions, offering accurate assessments and treatment plans tailored to each patient’s needs.',
        fees: 40,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc13',
        name: 'Dr. Chloe Osmena',
        image: doc13,
        speciality: 'General physician',
        degree: 'Doctor of Medicine (MD)',
        experience: '4 Years',
        about: 'Dr. Osmena delivers primary healthcare services, focusing on early diagnosis, preventive care, and treatment of common medical conditions.',
        fees: 40,
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc14',
        name: 'Dr. Ryan Martinez',
        image: doc14,
        speciality: 'Gynecologist',
        degree: 'Doctor of Medicine (MD)',
        experience: '4.5 Years',
        about: 'Dr. Martinez specializes in women’s reproductive health, offering consultations, screenings, and care for various gynecological conditions.',
        fees: 40,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc15',
        name: 'Dr. Amelia Alcazar',
        image: doc15,
        speciality: 'Dermatologist',
        degree: 'Doctor of Medicine (MD)',
        experience: '5.5 Years',
        about: 'Dr. Alcazar provides expert care for skin, hair, and nail concerns, helping patients manage conditions and maintain healthy skin through personalized treatments.',
        fees: 55,
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
]