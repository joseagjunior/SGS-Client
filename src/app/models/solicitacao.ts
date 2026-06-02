import { Categoria } from "./categoria";
import { Solicitante } from "./solicitante";

export interface Solicitacao {
    id: number;
    solicitante?: Solicitante;
    solicitanteId?: number;
    categoria?: Categoria;
    categoriaId?: number;
    descricao?: string;
    valor: number;
    dataSolicitacao?: string;
    status?: string;
}

export interface SolicitacaoListagem {
    id: number;
    solicitanteNome: string;
    cpfCnpj: string;
    categoriaNome: string;
    status: string;
    valor: number;
    dataSolicitacao: string;
}

export interface HistoricoSolicitacao {
    id: number;
    statusAnterior: string;
    statusNovo: string;
    dataAlteracao: string;
}

export const STATUS_LIST = [
    'SOLICITADO',
    'LIBERADO',
    'APROVADO',
    'REJEITADO',
    'CANCELADO'
];