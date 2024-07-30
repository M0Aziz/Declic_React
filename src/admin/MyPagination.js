import { useTranslate, useListContext } from 'react-admin';
import { Pagination } from 'react-admin';

const MyPagination = props => {
    const { page, perPage, total } = useListContext();
    const translate = useTranslate();

    const from = (page - 1) * perPage + 1;
    const to = page * perPage > total ? total : page * perPage;

    return (
        <div>
            <Pagination rowsPerPageOptions={[10, 25, 50, 100]} {...props} />
            <div>
                {translate('ra.navigation.page_range_info', { from, to, count: total })}
            </div>
        </div>
    );
};

export default MyPagination;
