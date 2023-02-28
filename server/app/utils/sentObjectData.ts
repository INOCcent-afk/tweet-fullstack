interface Props {
	success: boolean;
	data: any;
}
const sentObjectData = (success: boolean, data: any) => {
	return { success, data };
};

export default sentObjectData;
