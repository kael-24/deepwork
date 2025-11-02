import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
    rectSortingStrategy
} from "@dnd-kit/sortable";

export default function DnDWrapper({ items, setItems, children, type }) {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const handleDragEnd = ({ active, over }) => {
        if (!over || active.id === over.id) return;

        setItems((currentItems) => {
            const oldIndex = currentItems.findIndex((item) => item.id === active.id);
            const newIndex = currentItems.findIndex((item) => item.id === over.id);
            if (oldIndex === -1 || newIndex === -1) return currentItems;
            return arrayMove(currentItems, oldIndex, newIndex);
        });
    };

    const validItems = Array.isArray(items) ? items : [];
    const itemIds = validItems.map((item) => item.id);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={itemIds} strategy={type === "vertical" ? verticalListSortingStrategy : rectSortingStrategy}>
                {children}
            </SortableContext>
        </DndContext>
    );
}
