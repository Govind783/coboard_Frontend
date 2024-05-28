export const CustomSlashMenu = (props) => {
    const filteredItems = props.items.filter((item) => item.title !== "Image");
    return (
        <div className={"slash-menu bg-slate-900 border border-gray-700 w-80 p-4"}>
            {filteredItems.map((item, index) => (
                <div
                key={index}
                    className={`slash-menu-item${props.selectedIndex === index ? "mantine-Menu-itemSection" : ""} ${index != 6 && 'mb-2'} h-10 flex items-center cursor-pointer  rounded-md hover:bg-slate-700 transition-all ease-in duration-150 w-full px-4 py-2`}
                    onClick={() => props.onItemClick?.(item)}
                >
                    {item.title}
                </div>
            ))}
        </div>
    );
}