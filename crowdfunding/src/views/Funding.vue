<template>
  <div>
    <a-card 
      class="ant-card-shadow" 
      :loading="state.loading" 
      :tab-list="tabList"
      :active-tab-key="key"
      @tabChange="onTabChange"
    >
      <template #title>
        <h3>
          {{state.data.title}}
          <span style="float:right">
            你投资了 {{state.myAmount}} Eth
            <a-button type="primary" v-if="new Date(state.data.endTime * 1000) > new Date() && state.data.success == false" @click="openModal">我要投资</a-button>
            <a-button type="danger" v-if="!state.data.success && state.myAmount != 0" @click="returnM">退钱！</a-button>
          </span>
        </h3>
      </template>
      <a-descriptions bordered v-if="key==='info'">
        <a-descriptions-item label="众筹标题" :span="2">
          {{state.data.title}}
        </a-descriptions-item>
        <a-descriptions-item label="众筹发起人" :span="2">
          {{state.data.initiator}}
        </a-descriptions-item>
        <a-descriptions-item label="截止日期" :span="2">
           {{new Date(state.data.endTime * 1000).toLocaleString()}}
        </a-descriptions-item>
        <a-descriptions-item label="当前状态">
          <a-tag color="success" v-if="state.data.success === true">
            <template #icon>
              <check-circle-outlined />
            </template>
            众筹成功
          </a-tag>
          <a-tag color="processing" v-else-if="new Date(state.data.endTime * 1000) > new Date()" >
            <template #icon>
              <sync-outlined :spin="true" />
            </template>
            正在众筹
          </a-tag>
          <a-tag color="error" v-else>
            <template #icon>
              <close-circle-outlined />
            </template>
            众筹失败
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="目标金额">
          <a-statistic :value="state.data.goal">
            <template #suffix>
              Eth
            </template>
          </a-statistic>
        </a-descriptions-item>
        <a-descriptions-item label="当前金额">
          <a-statistic :value="state.data.amount">
            <template #suffix>
              Eth
            </template>
          </a-statistic>
        </a-descriptions-item>
        <a-descriptions-item label="众筹进度">
          <a-progress type="circle" :percent="state.data.success ? 100 : state.data.amount * 100 / state.data.goal" :width="80" />
        </a-descriptions-item>
        <a-descriptions-item label="众筹介绍">
          {{state.data.info}}
        </a-descriptions-item>
      </a-descriptions>

      <Use v-if="key==='use'" :id="id" :data="state.data" :amount="state.myAmount"></Use>

    </a-card>

    <Modal v-model:visible="isOpen">
      <a-card style="width: 600px; margin: 0 2em;" :body-style="{ overflowY: 'auto', maxHeight: '600px' }">
        <template #title><h3 style="text-align: center">投资</h3></template>
        <create-form :model="model" :form="form" :fields="fields" />
      </a-card>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from 'vue';
import { getOneFunding, Funding, getAccount, getMyFundingAmount, contribute, returnMoney, addListener } from '../api/contract'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue';
import { CheckCircleOutlined, SyncOutlined, CloseCircleOutlined } from '@ant-design/icons-vue'
import Modal from '../components/base/modal.vue'
import CreateForm from '../components/base/createForm.vue'
import Use from '../components/Use.vue'
import { Model, Fields, Form } from '../type/form'

const column = [
  {
    dataIndex: ''
  }
]

const tabList = [
  {
    key: 'info',
    tab: '项目介绍',
  },
  {
    key: 'use',
    tab: '使用请求',
  },
];

export default defineComponent({
  name: 'Funding',
  components: { Modal, CreateForm, CheckCircleOutlined, SyncOutlined, CloseCircleOutlined, Use },
  setup() {
    // =========基本数据==========
    const route = useRoute();
    const id = parseInt(route.params.id as string);
    const account = ref('');
    const state = reactive<{data: Funding | {}, loading: boolean, myAmount: number}>({
      data: {},
      loading: true,
      myAmount: 0
    })

    // ===========发起投资表单============
    const isOpen = ref(false);
    function openModal() { isOpen.value = true }
    function closeModal() { isOpen.value = false }

    const model = reactive<Model>({
      value: 1
    })
    const fields = reactive<Fields>({
      value: {
        type: 'number',
        min: 1,
        label: '投资金额'
      }
    })
    const form = reactive<Form>({
      submitHint: '投资',
      cancelHint: '取消',
      cancel: () => {
        closeModal();
      },
      finish: async () => {
        try {
          await contribute(id, model.value);
          message.success('投资成功')
          fetchData();
          closeModal();
        } catch (e) {
          message.error('投资失败')
        }
      }
    })

    async function returnM() {
      try {
        await returnMoney(id);
        message.success('退钱成功');
        fetchData()
      } catch(e) {
        message.error('退钱失败')
      }
    }

    // =========切换标签页===========
    const key = ref('info');
    const onTabChange = (k : 'use' | 'info') => {
      key.value = k;
    }

    // =========加载数据===========
    async function fetchData() {
      state.loading = true;
      try {
        [state.data, state.myAmount] = await Promise.all([getOneFunding(id), getMyFundingAmount(id)]);
        state.loading = false;
        //@ts-ignore
        fields.value.max = state.data.goal - state.data.amount;
      } catch (e) {
        console.log(e);
        message.error('获取详情失败');
      }
    }

    addListener(fetchData)

    getAccount().then(res => account.value = res)
    fetchData();

    return {state, account, isOpen, openModal, form, model, fields, tabList, key, onTabChange, id, returnM}
  }
});
</script>
