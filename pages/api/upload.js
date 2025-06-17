// pages/api/upload.js
import formidable from 'formidable';
import fs from 'fs';
import { supabase } from '../../lib/supabase';

export const config = {
  api: {
    bodyParser: false, // obrigatório para funcionar com formidable
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const form = new formidable.IncomingForm({ keepExtensions: true, multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Erro no parse do formulário:', err);
      return res.status(500).json({ error: 'Erro ao processar o upload' });
    }

    const file = files.file;

    if (!file || !file.filepath) {
      return res.status(400).json({ error: 'Arquivo não recebido corretamente' });
    }

    try {
      const data = fs.readFileSync(file.filepath);
      const filename = `${Date.now()}_${file.originalFilename}`;

      const { error: uploadError } = await supabase.storage
        .from('arquivos')
        .upload(filename, data, {
          contentType: file.mimetype,
        });

      if (uploadError) {
        console.error('Erro no upload para Supabase:', uploadError);
        return res.status(500).json({ error: uploadError.message });
      }

      const { error: insertError } = await supabase
        .from('arquivos')
        .insert({ nome: filename, data_envio: new Date().toISOString() });

      if (insertError) {
        console.error('Erro ao inserir metadados:', insertError);
        return res.status(500).json({ error: insertError.message });
      }

      res.status(200).json({ message: 'Upload realizado com sucesso' });
    } catch (readError) {
      console.error('Erro ao ler o arquivo:', readError);
      res.status(500).json({ error: 'Erro ao ler o arquivo para upload' });
    }
  });
}
