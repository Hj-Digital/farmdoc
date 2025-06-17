// pages/api/limpar.js
import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).end();

  try {
    // 1. Buscar todos os arquivos para deletar do storage
    const { data: arquivos, error: fetchError } = await supabase
      .from('arquivos')
      .select('nome');

    if (fetchError) {
      return res.status(500).json({ error: 'Erro ao buscar arquivos: ' + fetchError.message });
    }

    const nomes = arquivos.map((a) => a.nome);

    // 2. Deletar arquivos do storage
    const { error: deleteStorageError } = await supabase
      .storage
      .from('arquivos')
      .remove(nomes);

    if (deleteStorageError) {
      return res.status(500).json({ error: 'Erro ao deletar arquivos do storage: ' + deleteStorageError.message });
    }

    // 3. Deletar todos os registros da tabela
    const { error: deleteDBError } = await supabase
      .from('arquivos')
      .delete()
      .gt('id', 0); // <- isso funciona como "deletar todos"

    if (deleteDBError) {
      return res.status(500).json({ error: 'Erro ao deletar registros do banco: ' + deleteDBError.message });
    }

    return res.status(200).json({ message: 'Todos os arquivos foram apagados com sucesso.' });

  } catch (err) {
    return res.status(500).json({ error: 'Erro inesperado: ' + err.message });
  }
}
