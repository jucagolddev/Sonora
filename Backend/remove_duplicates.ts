
import db from './config/db';

async function removeDuplicateCategories() {
    try {
        console.log('--- Checking for duplicate categories ---');

        // 1. Find duplicates
        const [rows]: any = await db.query(`
            SELECT nombre_categoria, GROUP_CONCAT(id_categoria ORDER BY id_categoria ASC) as ids, COUNT(*) as count 
            FROM categorias 
            GROUP BY nombre_categoria 
            HAVING count > 1
        `);

        if (rows.length === 0) {
            console.log('No duplicate categories found.');
            process.exit(0);
        }

        console.log(`Found ${rows.length} duplicate groups.`);

        for (const row of rows) {
            const ids = row.ids.split(',');
            const keepId = ids[0];
            const deleteIds = ids.slice(1);

            console.log(`Category: "${row.nombre_categoria}" | Keep ID: ${keepId} | Delete IDs: ${deleteIds.join(', ')}`);

            // 2. Delete the duplicates
            // Depending on if `canciones` uses ID or Name, this might be safe. 
            // Based on schema, 'canciones' uses 'categoria' (varchar). 
            // So deleting the extra ID from 'categorias' table is safe.
            
            const [result]: any = await db.query(`DELETE FROM categorias WHERE id_categoria IN (?)`, [deleteIds]);
            console.log(`  -> Deleted ${result.affectedRows} rows.`);
        }

        console.log('--- Cleanup complete ---');
        process.exit(0);

    } catch (error) {
        console.error('Error during cleanup:', error);
        process.exit(1);
    }
}

removeDuplicateCategories();
