export interface IItem {
    title: string;
    description: string;
    avatar: string | null;
    done: number;
    inprogress: number;
    waiting: number;
    archive: number;
}

export default IItem;
