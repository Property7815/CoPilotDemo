import { DetailsList, DetailsListLayoutMode, IColumn, Spinner, SpinnerSize } from '@fluentui/react';
import { ApiClient, IGroupDto } from 'app/generated/backend';
import React, { useEffect, useState } from 'react';

const Groups: React.FC = () => {
    const [data, setData] = useState({
        groups: [] as IGroupDto[],
        isFetching: false
    });

    const groupKeys: IGroupDto = {
        id: 0,
        name: '',
        isActive: false,
        createdDate: new Date(),
        updatedDate: new Date()
    };

    const columns = Object.keys(groupKeys).map((key): IColumn => {
        return {
            key,
            name: key.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => {
                return str.toUpperCase();
            }),
            fieldName: key,
            minWidth: 100,
            maxWidth: 200,
            isResizable: true
        };
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setData({ groups: data.groups, isFetching: true });
                const result = await new ApiClient(process.env.REACT_APP_API_BASE).groups_GetAllGroups();
                setData({ groups: result, isFetching: false });
            } catch (e) {
                console.log(e);
                setData({ groups: data.groups, isFetching: false });
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <h2>Groups</h2>
            {
                // Create a button for adding a new group to the list
                <button
                    onClick={() => {
                        const groups = data.groups;
                        const newGroup: IGroupDto = {
                            id: groups.length + 1,
                            name: `Group ${groups.length + 1}`,
                            isActive: true,
                            createdDate: new Date(),
                            updatedDate: new Date()
                        };
                        groups.push(newGroup);
                        setData({ groups: groups, isFetching: false });
                    }}
                >
                    Add new group
                </button>
            }
            {
                // Create a button for removing the last group from the list
                // Disable the button if there are no groups in the list
                <button
                    disabled={data.groups.length === 0}
                    onClick={() => {
                        const groups = data.groups;
                        groups.pop();
                        setData({ groups: groups, isFetching: false });
                    }}
                >
                    Remove last group
                </button>
            }
            <DetailsList
                items={data.groups.map((group) => {
                    return {
                        ...group,
                        createdDate: group.createdDate.toLocaleString(),
                        updatedDate: group.updatedDate.toLocaleString(),
                        isActive: group.isActive.toString()
                    };
                })}
                columns={columns}
                layoutMode={DetailsListLayoutMode.justified}
            />
            {data.isFetching && <Spinner size={SpinnerSize.large} />}
        </>
    );
};

export default Groups;
