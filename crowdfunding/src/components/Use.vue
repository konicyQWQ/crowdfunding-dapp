<template>
  <div>
    <a-button type="primary" @click="openModal" v-if="account === data.initiator && data.success">发起使用请求</a-button>
    <a-table :loading="state.loading" :data-source="state.data" :columns="columns">
      <template #expandedRowRender="{ record }">
        <p style="margin: 0">
          {{ record.info }}
        </p>
      </template>
      <template #over="{text, record}">
        <a-tag color="processing" v-if="record.over === false" >
          <template #icon>
            <sync-outlined :spin="true" />
          </template>
          正在等待通过
        </a-tag>
        <a-tag color="success" v-else-if="record.agreeAmount >= record.goal / 2">
          <template #icon>
            <check-circle-outlined />
          </template>
          批准使用
        </a-tag>
        <a-tag color="error" v-else>
          <template #icon>
            <close-circle-outlined />
          </template>
          拒绝请求
        </a-tag>
      </template>
      <template #action="{text, record}" v-if="amount != 0">
        <a-button v-if="(record.agree == 0 || record.agree == 2) && record.over === false" type="primary" @click="clickAgreeUse(true, record.index)">
          同意
        </a-button>
        <a-divider type="vertical"></a-divider>
        <a-button v-if="(record.agree == 0 || record.agree == 1) && record.over === false" type="danger" @click="clickAgreeUse(false, record.index)">
          不同意
        </a-button>
      </template>
    </a-table>

    <Modal v-model:visible="isOpen">
      <a-card style="width: 600px; margin: 0 2em;" :body-style="{ overflowY: 'auto', maxHeight: '600px' }">
        <template #title><h3 style="text-align: center">发起使用请求</h3></template>
        <create-form :model="model" :form="form" :fields="fields" />
      </a-card>
    </Modal>
  </div>
</template>

<script lang="ts">
import { message } from 'ant-design-vue';
import { defineComponent, ref, reactive, PropType, watch } from 'vue';
import { getAccount, getAllUse, Funding, agreeUse, newUse, Use, addListener } from '../api/contract'
import Modal from '../components/base/modal.vue'
import CreateForm from '../components/base/createForm.vue'
import { Model, Fields, Form } from '../type/form'
import { CheckCircleOutlined, SyncOutlined, CloseCircleOutlined } from '@ant-design/icons-vue'

const columns = [
  {
    dataIndex: 'info',
    key: 'info',
    title: '使用说明'
  },
  {
    dataIndex: 'goal',
    key: 'goal',
    title: '使用金额(eth)'
  },
  {
    dataIndex: 'agreeAmount',
    key: 'agreeAmount',
    title: '同意请求数额(eth)'
  },
  {
    dataIndex: 'disagree',
    key: 'disagree',
    title: '不同意请求数额(eth)'
  },
  {
    dataIndex: 'over',
    key: 'over',
    title: '状态',
    slots: { customRender: 'over' }
  },
  {
    dataIndex: 'action',
    key: 'action',
    title: '操作',
    slots: { customRender: 'action' }
  }
]

export default defineComponent({
  name: 'Use',
  props: {
    id: Number,
    data: Object as PropType<Funding>,
    amount: Number,
  },
  components: { Modal, CreateForm, CheckCircleOutlined, SyncOutlined, CloseCircleOutlined },
  setup(props) {
    const state = reactive<{loading: boolean, data: Use[]}>({
      loading: true,
      data: []
    })
    const account = ref('')

    // ========发起请求表单========
    const isOpen = ref(false);
    function openModal() { isOpen.value = true }
    function closeModal() { isOpen.value = false }

    const model = reactive<Model>({
      info: '',
      goal: 0
    })
    const fields = reactive<Fields>({
      info: {
        type: 'textarea',
        label: '请求说明'
      },
      goal: {
        type: 'number',
        min: 0,
        label: '请求金额'
      }
    })
    const form = reactive<Form>({
      submitHint: '发起请求',
      cancelHint: '取消',
      cancel: () => {
        closeModal();
      },
      finish: async () => {
        try {
          await newUse(props.id as number, model.goal, model.info);
          message.success('发起请求成功')
          fetchData();
          closeModal();
        } catch (e) {
          message.error('发起请求失败')
        }
      }
    })

    watch(() => props.data, () => {
      if(props.data) {
        fields.goal.max = props.data.amount;
      }
    })

    // ========获取数据==========
    async function fetchData() {
      state.loading = true;
      try {
        state.data = await getAllUse(props.id as number);
        account.value = await getAccount();
        state.loading = false;
      } catch (e) {
        console.log(e);
        message.error("获取使用请求失败");
      }
    }

    // ======= 是否同意 ==========
    async function clickAgreeUse(agree: boolean, useID: number) {
      try {
        await agreeUse(props.id as number, useID, agree);
        message.success('操作成功')
        fetchData();
      } catch (e) {
        console.log(e);
        message.error('操作失败')
      }
    }
    addListener(fetchData)
    fetchData();

    return { state, columns, account, isOpen, model, fields, form, openModal, clickAgreeUse }
  }
});
</script>
