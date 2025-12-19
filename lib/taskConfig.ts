// Centralized task configuration
// Add new tasks here as you create them

export interface TaskConfig {
    id: string;
    title: string;
    description?: string;
    taskCategory?: 'warehouse' | 'office'; // Task category: warehouse or office
    productivityBonus?: number; // Overall task productivity bonus (e.g., +2 for add-product)
    items: ChecklistItem[];
}

export interface ChecklistItem {
    id: string;
    description: string;
    points: number; // Team points
    attribute?: 'attendance' | 'social' | 'productivity' | 'intensity' | null;
    attributePoints?: number;
    specialty?: string | null;
    specialtyPoints?: number;
    subItems?: ChecklistItem[];
}

// Task configurations
export const taskConfigs: TaskConfig[] = [
    {
        id: "add-product",
        title: "Add a product to the store",
        description: "Complete all steps to add a new product to the Shopify store",
        taskCategory: 'office', // Office task
        productivityBonus: 2, // +2 productivity points for all assigned players
        items: [
            { id: "1", description: "Set title", points: 1 },
            { id: "2", description: "Set description", points: 1 },
            { id: "3", description: "Upload media", points: 1, specialty: "Finer Details", specialtyPoints: 0.5 },
            { id: "4", description: "Set product type", points: 0.5 },
            { id: "5", description: "Set vendor", points: 0.5 },
            { id: "6", description: "Set appropriate tags, especially trade related", points: 1, specialty: "Operational Backbone", specialtyPoints: 0.5 },
            { id: "7", description: "Assign appropriate theme template", points: 0.5 },
            { id: "8", description: "Set a default price greater than $0", points: 1 },
            { id: "9", description: "Set SKU", points: 1, specialty: "Product Knowledge", specialtyPoints: 1 },
            { id: "10", description: "Add variant options if necessary", points: 1.5 },
            { id: "11", description: "Set appropriate metafields", points: 2, specialty: "Digital Expert", specialtyPoints: 1 },
            { id: "12", description: "Set meta title less than 66 characters", points: 1, specialty: "Finer Details", specialtyPoints: 0.5 },
            { id: "13", description: "Set meta description less than 160 characters", points: 1, specialty: "Finer Details", specialtyPoints: 0.5 },
            { id: "14", description: "Set appropriate sales channels", points: 0.5 },
            { id: "15", description: "If necessary, set and confirm correct trade catalog pricing", points: 2, specialty: "Digital Expert", specialtyPoints: 1 },
            {
                id: "16",
                description: "Is the product a dangerous good?",
                points: 0,
                subItems: [
                    { id: "16-1", description: "No", points: 1 },
                    {
                        id: "16-2",
                        description: "Yes",
                        points: 0,
                        subItems: [
                            { id: "16-2-1", description: "Add product information to DG Register", points: 2, specialty: "Finer Details", specialtyPoints: 1 },
                            { id: "16-2-2", description: "Add product to Shopify DG Shipping Profile", points: 1, specialty: "Operational Backbone", specialtyPoints: 1 },
                            { id: "16-2-3", description: "Add SKU to Starshipit DG Checkout Rules", points: 2, specialty: "Digital Expert", specialtyPoints: 1 },
                        ]
                    },
                ]
            },
            { id: "17", description: "Confirm product is correctly linked and loaded in to Cin7 Core", points: 1 },
            { id: "18", description: "Update inventory quantities in Cin7", points: 1 },
            { id: "19", description: "Once product is finalised, confirm Bombley product load", points: 2, specialty: "Digital Expert", specialtyPoints: 1 },
            { id: "20", description: "Set product status to Active", points: 1, attribute: 'social', attributePoints: 1 },
        ]
    },
    {
        id: "receive-shipment",
        title: "Receive a shipment",
        description: "Complete all steps to receive a shipment delivered to the warehouse",
        taskCategory: 'warehouse', // Warehouse task
        productivityBonus: 3, // +3 productivity points for all assigned players
        items: [
            { id: "1", description: "Take products off truck/van", points: 2, specialty: "Forklift Certified", specialtyPoints: 1, attribute: 'social', attributePoints: 1 },
            { id: "2", description: "Bring products to shelves", points: 0.5 },
            { id: "3", description: "Count stock", points: 1, specialty: "Warehouse Warrior", specialtyPoints: 0.5 },
            { id: "4", description: "Send receipt to Silvana via Notion", points: 2, specialty: "Operational Backbone", specialtyPoints: 1 },
            { id: "5", description: "Place items on shelves", points: 1, specialty: "Warehouse Warrior", specialtyPoints: 0.5 },
            { id: "5", description: "Move excess items to bulk storage", points: 1 },
        ]
    },
    // Add more tasks here as you create them
    // Example:
    // {
    //     id: "update-product",
    //     title: "Update an existing product",
    //     description: "Update product information in the store",
    //     productivityBonus: 1,
    //     items: [
    //         { id: "1", description: "Update title", points: 1 },
    //         // ... more items
    //     ]
    // },
];

// Helper function to get task config by ID
export function getTaskConfig(taskId: string): TaskConfig | undefined {
    return taskConfigs.find(task => task.id === taskId);
}

// Helper function to get all task IDs and titles for the task list
export function getAllTasks(): Array<{ id: string; title: string; description?: string }> {
    return taskConfigs.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description
    }));
}

