import { useEffect } from 'react';
import {
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Tag,
  Card,
  Box
} from '@chakra-ui/react';
import { formatModelStatus } from '@/constants/model';
import dayjs from 'dayjs';
import type { ModelSchema } from '@/types/mongoSchema';
import { useRouter } from 'next/router';
import { modelList } from '@/constants/model';

const ModelTable = ({
  models = [],
  handlePreviewChat
}: {
  models: ModelSchema[];
  handlePreviewChat: (_: string) => void;
}) => {
  const router = useRouter();
  const columns = [
    {
      title: '模型名',
      key: 'name',
      dataIndex: 'name'
    },
    {
      title: '模型类型',
      key: 'service',
      render: (model: ModelSchema) => (
        <Box fontWeight={'bold'} whiteSpace={'pre-wrap'} maxW={'200px'}>
          {modelList.find((item) => item.model === model.service.modelName)?.name}
        </Box>
      )
    },
    {
      title: '最后更新时间',
      key: 'updateTime',
      render: (item: ModelSchema) => dayjs(item.updateTime).format('YYYY-MM-DD HH:mm')
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      render: (item: ModelSchema) => (
        <Tag
          colorScheme={formatModelStatus[item.status]?.colorTheme}
          variant="solid"
          px={3}
          size={'md'}
        >
          {formatModelStatus[item.status]?.text}
        </Tag>
      )
    },

    {
      title: '操作',
      key: 'control',
      render: (item: ModelSchema) => (
        <>
          <Button mr={3} onClick={() => handlePreviewChat(item._id)}>
            对话
          </Button>
          <Button
            variant={'outline'}
            onClick={() => router.push(`/model/detail?modelId=${item._id}`)}
          >
            编辑
          </Button>
        </>
      )
    }
  ];

  useEffect(() => {
    router.prefetch('/chat');
  }, [router]);

  return (
    <Card py={3}>
      <TableContainer>
        <Table variant={'simple'}>
          <Thead>
            <Tr>
              {columns.map((item) => (
                <Th key={item.key}>{item.title}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {models.map((item) => (
              <Tr key={item._id}>
                {columns.map((col) => (
                  <Td key={col.key}>
                    {col.render
                      ? col.render(item)
                      : !!col.dataIndex
                      ? // @ts-ignore nextline
                        item[col.dataIndex]
                      : ''}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default ModelTable;