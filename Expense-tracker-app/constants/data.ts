import { CategoryType, ExpenseCategoriesType } from '@/types'
import * as Icons from 'phosphor-react-native'

export const expenseCategories: ExpenseCategoriesType= {

    groceries:{
        label: "Groceries",
        value:"groceries",
        icon: Icons.ShoppingCart,
        bgColor: '#4B5563'
    },
    rent:{
        label: "Rent",
        value: 'rent',
        icon: Icons.House,
        bgColor: '#075985'
    },
    utilities:{
        label: "Utilities",
        value: "utilities",
        icon: Icons.Lightbulb,
        bgColor: "#ca8a04",
    },
    transportation:{
        label:"Transportation",
        value: "transportation",
        icon: Icons.Car,
        bgColor: '#b45309'
    },
    entertainment:{
        label:"Entertainment",
        value:"entertainment",
        icon: Icons.FilmStrip,
        bgColor: "#0f766e"
    },
    dining:{
        label: "Dinning",
        value: "dinning",
        icon: Icons.ForkKnife,
        bgColor: "#be185d"
    },
    health:{
        label:"Health",
        value: "health",
        icon: Icons.Heart,
        bgColor:"#e11d48"
    },
    insurance:{
        label: "Insurance",
        value: "insurance",
        icon: Icons.ShieldCheck,
        bgColor: "#065F46"
    },
    clothing:{
        label:"Clothing",
        value:"clothing",
        icon: Icons.TShirt,
        bgColor:"#7c3aed"
    },
    personal:{
        label:"Personal",
        value:"personal",
        icon :Icons.User,
        bgColor:"#a21caf"
    },
    others:{
        label: "Others",
        value: "others",
        icon: Icons.DotsThreeOutline,
        bgColor: "#525252"
    },

};

export const incomeCategories: ExpenseCategoriesType= {

    salary:{
        label: "Salary",
        value:"salary",
        icon: Icons.CurrencyDollarSimple,
        bgColor: '#16a34a'
    },
    freelance:{
        label: "Freelance",
        value: 'freelance',
        icon: Icons.Briefcase,
        bgColor: '#059669'
    },
    investment:{
        label: "Investment",
        value: "investment",
        icon: Icons.ChartLine,
        bgColor: "#0d9488",
    },
    business:{
        label:"Business",
        value: "business",
        icon: Icons.Storefront,
        bgColor: '#0891b2'
    },
    gifts:{
        label:"Gifts",
        value:"gifts",
        icon: Icons.Gift,
        bgColor: "#7c3aed"
    },
    other_income:{
        label: "Other Income",
        value: "other_income",
        icon: Icons.CurrencyDollar,
        bgColor: "#65a30d"
    },

};

export const incomeCategory: CategoryType = {
    label: "Income",
    value: "income",
    icon: Icons.CurrencyDollarSimple,
    bgColor: "#16a34a"
};

export const transactionTypes = [
    {label: "Expense", value:"expense"},
    {label: "Income" , value: "income"},
];